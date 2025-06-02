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
  getSpecificOrdersCount,
  getRankings,
  getCCOptions,
} from "../controllers/Get.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.post("/get-upload", auth, getUploads);

router.get("/get-update-upload", auth, getUpdateUploads);

router.get("/get-orders/", auth, getOrders);

router.post("/expert/orders", auth, getAllOrders);

router.get("/expert/order", auth, getExpertOrder);

router.get("/get-completed-orders", auth, getCompletedOrders);

router.get("/get-documents", auth, getDocuments);

router.get("/get-specific-document/:type", auth, getSpecificDocument);

router.get("/get-user-files/:profileId", auth, getUserFiles);

router.get("/get-specific-count", getSpecificOrdersCount);

router.get("/types", auth, getAllTypes);

router.post("/get-rankings", getRankings);

router.get("/get-cc-list", getCCOptions);

export default router;
