import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { pool } from "./db.js";

dotenv.config();

const app = express();

// CORS origins list from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman / server-to-server
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// health check
app.get("/", (req, res) => res.send("Backend is running ✅"));

// test db connection
app.get("/api/health/db", async (req, res) => {
  try {
    const r = await pool.query("SELECT 1 as ok");
    res.json({ ok: true, db: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
