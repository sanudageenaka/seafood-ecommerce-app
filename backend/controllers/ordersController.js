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
    paymentMethod = "cod", // default cod
    cardType = null,       // only for online
    items,                 // ✅ [{ id, qty }] (kg only)
    deliveryDate = null,   // optional: backend can set today+2 days if you want
  } = req.body;

  // ✅ Validate order fields
  if (!firstName?.trim()) return res.status(400).json({ error: "First name is required" });
  if (!phone?.trim()) return res.status(400).json({ error: "Mobile number is required" });
  if (!address?.trim()) return res.status(400).json({ error: "Delivery address is required" });
  if (!city?.trim()) return res.status(400).json({ error: "City is required" });

  // ✅ Validate payment
  if (!["cod", "online"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Invalid payment method" });
  }

  if (paymentMethod === "online" && !["debit", "credit"].includes(cardType)) {
    return res.status(400).json({ error: "Card type is required for online payments" });
  }

  // ✅ Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ✅ create order WITHOUT totals (price calculated later)
  const orderInsert = await client.query(
  `INSERT INTO orders (
    user_id,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    instructions,
    payment_method,
    card_type,
    subtotal,
    delivery_fee,
    total,
    status,
    pricing_status
  )
  VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
  )
  RETURNING *`,
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

    0, // subtotal (price calculated later)
    0, // delivery_fee
    0, // total

    "pending_pricing",
    "pending_pricing",
  ]
);

    const order = orderInsert.rows[0];

    // ✅ Insert order items (kg only)
   for (const it of items) {
  // ✅ accept multiple field names safely
  const productId = Number(it.id ?? it.product_id ?? it.productId);
  const qty = Number(it.qty ?? it.kg ?? it.quantity);

  // ✅ debug: show which item is wrong
  if (!Number.isFinite(productId) || productId <= 0 || !Number.isFinite(qty) || qty <= 0) {
    console.log("❌ INVALID ITEM RECEIVED:", it);
    throw new Error("Invalid item data");
  }

  const productRes = await client.query(
    "SELECT name FROM products WHERE id=$1",
    [productId]
  );

  if (productRes.rowCount === 0) {
    console.log("❌ PRODUCT NOT FOUND:", productId);
    throw new Error("Product not found");
  }

  const productName = productRes.rows[0].name;

  await client.query(
    `INSERT INTO order_items (order_id, product_id, name, qty)
     VALUES ($1,$2,$3,$4)`,
    [order.id, productId, productName, qty]
  );
}

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order created",
      orderId: order.id,
      status: order.status,
    });
  } catch (e) {
    await client.query("ROLLBACK");

    console.error("CREATE ORDER ERROR:", {
      message: e?.message,
      code: e?.code,
      detail: e?.detail,
      where: e?.where,
      constraint: e?.constraint,
    });

    return res.status(500).json({
      error: "Failed to create order",
      details: e?.detail || e?.message || "Unknown server error",
      code: e?.code || null,
      constraint: e?.constraint || null,
    });
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
    `UPDATE orders
     SET status='paid', updated_at=now()
     WHERE id=$1
     RETURNING *`,
    [id]
  );

  if (updated.rowCount === 0) return res.status(404).json({ error: "Order not found" });

  return res.json({ message: "Order marked as paid", order: updated.rows[0] });
}