// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* -----------------------------
   ✅ CORS (Vercel + Domain + Local)
   Fixes: "No 'Access-Control-Allow-Origin' header" + preflight OPTIONS
------------------------------ */
const allowedOrigins = [
  "https://oceanwave4u.com",
  "https://www.oceanwave4u.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman / server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ must answer preflight
app.options("*", cors());

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
   ✅ Health checks
------------------------------ */
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/* -----------------------------
   ✅ Start server (Railway uses PORT)
------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
