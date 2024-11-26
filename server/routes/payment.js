import express from "express";
import {
  getDetails,
  applyOrders,
  paymentStatus,
  verification,
} from "../controllers/Payment.js";

const router = express.Router();

router.get("/get-details", getDetails);

router.post("/orders/:applyId", applyOrders);

router.get("/status", paymentStatus);

router.post("/verification", verification);

export default router;
