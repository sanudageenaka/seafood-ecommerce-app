import { pool } from "../db.js";

export const listProducts = async (req, res) => {
  try {
    const { q, sort, min, max } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];
    let i = 1;

    if (q) {
      sql += ` AND (name ILIKE $${i} OR description ILIKE $${i + 1})`;
      params.push(`%${q}%`, `%${q}%`);
      i += 2;
    }

    if (min) {
      sql += ` AND price >= $${i}`;
      params.push(Number(min));
      i++;
    }

    if (max) {
      sql += ` AND price <= $${i}`;
      params.push(Number(max));
      i++;
    }

    if (sort === "price_asc") sql += " ORDER BY price ASC";
    else if (sort === "price_desc") sql += " ORDER BY price DESC";
    else sql += " ORDER BY created_at DESC";

    const result = await pool.query(sql, params);

    res.json(result.rows);
  } catch (e) {
    console.error("LIST PRODUCTS ERROR:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error("GET PRODUCT ERROR:", e);
    res.status(500).json({ error: e.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url || null;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, image_url)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        name,
        description || null,
        Number(price),
        category || null,
        image_url,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error("CREATE PRODUCT ERROR:", e);
    res.status(500).json({ error: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;

    const newImageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : image_url || null;

    const result = await pool.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, category=$4, image_url=$5
       WHERE id=$6
       RETURNING *`,
      [
        name,
        description || null,
        Number(price),
        category || null,
        newImageUrl,
        id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error("UPDATE PRODUCT ERROR:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (e) {
    console.error("DELETE PRODUCT ERROR:", e);
    res.status(500).json({ error: e.message });
  }
};