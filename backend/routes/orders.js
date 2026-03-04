// routes/orders.js
import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  // ✅ new (optional but recommended)
  priceOrder,
} from "../controllers/ordersController.js";

// OPTIONAL: admin middleware if you have it
// import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// ✅ Create order (kg only, no price)
router.post("/", auth, createOrder);

// ✅ User orders
router.get("/my", auth, getMyOrders);

// ✅ Get single order + items
router.get("/:id", auth, getOrderById);

// ✅ Mark paid (for online payments / admin)
router.patch("/:id/paid", auth, markOrderPaid);

// ✅ NEW: set final price later (delivery-day pricing)
// If you have admin middleware, use:
// router.patch("/:id/price", auth, adminOnly, priceOrder);
router.patch("/:id/price", auth, priceOrder);

export default router;