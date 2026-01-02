import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    // check existing
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // insert + get id back
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [name, email, password_hash]
    );

    const user = { id: result.rows[0].id, name, email };
    const token = signToken({ id: user.id });

    return res.status(201).json({ user, token });
  } catch (err) {
    // unique constraint fallback
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }

    console.error("REGISTER ERROR:", err?.message || err);
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const u = result.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = { id: u.id, name: u.name, email: u.email };
    const token = signToken({ id: user.id });

    return res.json({ user, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err?.message || err);
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1 LIMIT 1",
      [req.user.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("ME ERROR:", err?.message || err);
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
};
