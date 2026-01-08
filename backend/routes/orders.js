import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

export default router;
