import express from "express";

import {
  getUploads,
  getOrders,
  getAllOrders,
  getExpertOrder,
  getUpdateUploads,
  getCompletedOrders,
  getDocuments,
  getSpecificDocument,
  getUserFiles,
  getAllTypes,
} from "../controllers/Get.js";

const router = express.Router();

router.post("/get-upload", getUploads);

router.get("/get-update-upload", getUpdateUploads);

router.get("/get-orders/", getOrders);

router.get("/expert/orders", getAllOrders);

router.get("/expert/order", getExpertOrder);

router.get("/get-completed-orders", getCompletedOrders);

router.get("/get-documents", getDocuments);

router.get("/get-specific-document/:type", getSpecificDocument);

router.get("/get-user-files/:profileId", getUserFiles);

router.get("/types", getAllTypes);

export default router;
