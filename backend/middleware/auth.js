// middleware/auth.js
import jwt from "jsonwebtoken";
import { pool } from "../db.js"; // ✅ make sure path is correct (../db.js from middleware folder)

export const protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: Number(decoded.id) }; // ✅ force number
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ keep compatibility with your existing code using { auth }
export const auth = protect;

// ✅ optional: only for admin routes (create/update/delete products)
export const adminOnly = async (req, res, next) => {
  try {
    const r = await pool.query("SELECT is_admin FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!r.rowCount) return res.status(401).json({ error: "User not found" });

    if (r.rows[0].is_admin !== true) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (e) {
    return res.status(500).json({ error: "Admin check failed" });
  }
};
