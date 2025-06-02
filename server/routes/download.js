import express from "express";
import {
  downloadFiles,
  downloadStudentFile,
  downloadUserFile,
} from "../controllers/Download.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.get("/:type", auth, downloadFiles);

router.get("/student-file/:fileId", auth, downloadStudentFile);

router.get("/user-file/:profileId/:fileId", auth, downloadUserFile);

export default router;
