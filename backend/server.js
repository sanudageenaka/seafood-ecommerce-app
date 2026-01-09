// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();

/* -----------------------------
   ✅ CORS (Domain + Local)
------------------------------ */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/* -----------------------------
   ✅ Routes
------------------------------ */
import authRoutes from "./routes/authRoutes.js";
import ordersRoutes from "./routes/orders.js";     // ✅ ADD
import { pool } from "./db.js";

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);             // ✅ ADD

/* -----------------------------
   ✅ Health check
------------------------------ */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running ✅");
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/debug/db", async (req, res) => {
  try {
    const r = await pool.query("SELECT current_database() as db, current_schema() as schema");
    const t = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      ORDER BY table_name
    `);
    res.json({ connectedTo: r.rows[0], tables: t.rows.map(x => x.table_name) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});