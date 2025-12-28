import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";

const app = express();

/* --------------------------------------------------
   ✅ CORS CONFIG (Vercel + Local Dev + Postman)
-------------------------------------------------- */
const allowedOrigins = [
  "https://oceanwave4u.com",
  "https://www.oceanwave4u.com",
  "http://localhost:5173", // Vite dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: ${origin} is not allowed`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* --------------------------------------------------
   ✅ BODY PARSING
-------------------------------------------------- */
app.use(express.json()); // modern replacement for bodyParser.json()

/* --------------------------------------------------
   ✅ ROUTES
-------------------------------------------------- */
app.use("/api/auth", authRoutes);

/* --------------------------------------------------
   ✅ HEALTH CHECK (Railway debugging)
-------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ status: "API running 🚀" });
});

/* --------------------------------------------------
   ✅ START SERVER (Railway compatible)
-------------------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
