// controllers/ordersController.js
import { pool } from "../db.js";

export async function createOrder(req, res) {
  const userId = req.user?.id || null;

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    instructions,
    paymentMethod, // "cod" | "online"
    cardType,      // "debit" | "credit" (only for online)
    items,         // [{id,name,price,qty}]
    deliveryFee = 0,
  } = req.body;

  // ✅ Validate
  if (!firstName?.trim()) return res.status(400).json({ error: "First name is required" });
  if (!phone?.trim()) return res.status(400).json({ error: "Mobile number is required" });
  if (!address?.trim()) return res.status(400).json({ error: "Delivery address is required" });
  if (!city?.trim()) return res.status(400).json({ error: "City is required" });

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }

  if (!["cod", "online"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Invalid payment method" });
  }

  if (paymentMethod === "online" && !["debit", "credit"].includes(cardType)) {
    return res.status(400).json({ error: "Card type is required for online payments" });
  }

  // ✅ Calculate totals on server
  const subtotal = items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty), 0);
  const total = subtotal + Number(deliveryFee || 0);

  const status = paymentMethod === "cod" ? "cod_pending" : "pending";

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderInsert = await client.query(
      `INSERT INTO orders (
        user_id, first_name, last_name, email, phone, address, city, instructions,
        payment_method, card_type, subtotal, delivery_fee, total, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14
      ) RETURNING *`,
      [
        userId,
        firstName.trim(),
        lastName?.trim() || null,
        email?.trim() || null,
        phone.trim(),
        address.trim(),
        city.trim(),
        instructions?.trim() || null,
        paymentMethod,
        paymentMethod === "online" ? cardType : null,
        subtotal,
        Number(deliveryFee || 0),
        total,
        status,
      ]
    );

    const order = orderInsert.rows[0];

    for (const it of items) {
      const qty = Number(it.qty);
      const price = Number(it.price);

      if (!it.name || !qty || qty <= 0 || !price || price <= 0) {
        throw new Error("Invalid item data");
      }

      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, qty, line_total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, String(it.id ?? ""), String(it.name), price, qty, price * qty]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order created",
      orderId: order.id,
      total: order.total,
      status: order.status,
    });
  } catch (e) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: e.message || "Failed to create order" });
  } finally {
    client.release();
  }
}

export async function getMyOrders(req, res) {
  const userId = req.user.id;

  const orders = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  return res.json({ orders: orders.rows });
}

export async function getOrderById(req, res) {
  const { id } = req.params;

  const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);
  if (orderRes.rowCount === 0) return res.status(404).json({ error: "Order not found" });

  const itemsRes = await pool.query(
    `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
    [id]
  );

  return res.json({ order: orderRes.rows[0], items: itemsRes.rows });
}

export async function markOrderPaid(req, res) {
  const { id } = req.params;

  const updated = await pool.query(
    `UPDATE orders SET status='paid' WHERE id=$1 RETURNING *`,
    [id]
  );

  if (updated.rowCount === 0) return res.status(404).json({ error: "Order not found" });

  return res.json({ message: "Order marked as paid", order: updated.rows[0] });
}
