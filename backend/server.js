import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

/* --------------------------------------------------
   ✅ CORS CONFIG (Vercel + Local Dev + Postman)
-------------------------------------------------- */
const allowedOrigins = [
  "https://oceanwave4u.com",
  "https://www.oceanwave4u.com",
  "http://localhost:5173",
];

// ✅ IMPORTANT: do NOT throw errors for blocked origins in production,
// respond gracefully so preflight doesn't become 502.
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // block politely (no thrown error)
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS
app.use(cors(corsOptions));

// ✅ Handle preflight for ALL routes
app.options("*", cors(corsOptions));

/* --------------------------------------------------
   ✅ BODY PARSING
-------------------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
