import { pool } from '../config/db.js';

export const listProducts = async (req, res) => {
  try {
    const { q, sort, min, max } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (q) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    if (min) {
      sql += ' AND price >= ?';
      params.push(Number(min));
    }
    if (max) {
      sql += ' AND price <= ?';
      params.push(Number(max));
    }
    if (sort === 'price_asc') sql += ' ORDER BY price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
    else sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, Number(price), category || null, image_url]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    const newImageUrl = req.file ? `/uploads/${req.file.filename}` : image_url || null;
    await pool.query(
      'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?',
      [name, description, Number(price), category || null, newImageUrl, id]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
