import express from "express";
import {
  downloadFiles,
  downloadStudentFile,
  downloadUserFile,
} from "../controllers/Download.js";

const router = express.Router();

router.get("/:type", downloadFiles);

router.get("/student-file/:fileId", downloadStudentFile);

router.get("/user-file/:profileId/:fileId", downloadUserFile);

export default router;
