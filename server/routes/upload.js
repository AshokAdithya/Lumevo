import express from "express";
import {
  uploadTemplates,
  studentUpload,
  getUploads,
  deleteStudentFile,
  getOrders,
  getAllOrders,
  getUpdateUploads,
  getCompletedOrders,
  getDocuments,
  updateUploadedTemplates,
  getSpecificDocument,
  uploadUserFile,
  getUserFiles,
  expertUpload,
} from "../controllers/Upload.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload-template", upload.single("files"), uploadTemplates); //true

router.post("/student-upload", upload.single("files"), studentUpload); //true

// router.post("/get-upload", getUploads); //false

// router.get("/get-update-upload", getUpdateUploads);

// router.delete("/student-file/:fileId", deleteStudentFile);

// router.get("/get-orders/", getOrders);

// router.get("/admin/orders", getAllOrders);

// router.get("/admin/order", getAdminOrder);

router.post("/expert/upload", upload.single("files"), expertUpload);

router.put(
  "/admin-update/:id",
  upload.single("files"),
  updateUploadedTemplates
);

// router.get("/get-completed-orders", getCompletedOrders);

// router.get("/get-documents", getDocuments);

// router.get("/get-specific-document/:type", getSpecificDocument);

router.post("/user-file", upload.single("files"), uploadUserFile);

// router.get("/get-user-files/:profileId", getUserFiles);

export default router;
