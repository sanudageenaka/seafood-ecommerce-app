// routes/support.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * POST /api/support
 * Body: { name, phone, email?, orderNo?, category?, rating?, message, consent? }
 */
router.post("/", async (req, res) => {
  try {
    const {
      user_id = null,
      name,
      phone,
      email = null,
      orderNo = null,
      channel = "web",
      category = "Other",
      rating = null,
      message,
      consent = true,
    } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
    if (!phone?.trim()) return res.status(400).json({ error: "Phone is required" });
    if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Clean phone: allow leading + then digits only
    const cleanPhone = phone.startsWith("+")
      ? "+" + phone.slice(1).replace(/\D/g, "")
      : phone.replace(/\D/g, "");

    const q = `
      INSERT INTO support_requests
        (user_id, name, phone, email, order_no, channel, category, rating, message, consent)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, created_at;
    `;

    const values = [
      user_id,
      name.trim(),
      cleanPhone,
      email?.trim() || null,
      orderNo?.trim() || null,
      channel,
      category,
      rating,
      message.trim(),
      Boolean(consent),
    ];

    const result = await pool.query(q, values);

    return res.status(201).json({
      ok: true,
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;