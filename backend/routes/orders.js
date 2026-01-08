// routes/orders.js
import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.patch("/:id/paid", auth, markOrderPaid);

export default router;
