// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* -----------------------------
   ✅ CORS (Domain + Local)
------------------------------ */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// create ONE cors options object so OPTIONS uses same config
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman / server-to-server)
    if (!origin) return callback(null, true);

    // if env not set, allow all (safe for debugging; set env in production)
    if (allowedOrigins.length === 0) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ MUST answer preflight with SAME options
app.options("*", cors(corsOptions));

/* -----------------------------
   ✅ Body parsing
------------------------------ */
app.use(express.json());

/* -----------------------------
   ✅ Routes
------------------------------ */
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

/* -----------------------------
   ✅ Health check
------------------------------ */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running ✅");
});

/* -----------------------------
   ✅ Start server (Railway uses PORT)
------------------------------ */
const PORT = Number(process.env.PORT || 5000);

// ✅ bind to 0.0.0.0 for Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
