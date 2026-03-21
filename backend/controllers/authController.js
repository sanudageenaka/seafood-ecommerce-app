import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? ""); // ✅ DO NOT trim password

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    // check existing
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Insert user and return selected fields
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, password_hash]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({ user, token });
  } catch (err) {
    // unique constraint fallback
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }

    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? ""); // ✅ DO NOT trim password

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    const result = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1",
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

    const user = { id: u.id, name: u.name, email: u.email, role: u.role };
    const token = signToken({ id: user.id, role: user.role });

    return res.json({ user, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
};