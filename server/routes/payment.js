import express from "express";
import {
  getDetails,
  applyOrders,
  paymentStatus,
  verification,
} from "../controllers/Payment.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.get("/get-details", auth, getDetails);

router.post("/orders/:applyId", auth, applyOrders);

router.get("/status", paymentStatus);

router.post("/verification", auth, verification);

export default router;
