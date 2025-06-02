import express from "express";
import { deleteStudentFile } from "../controllers/Upload.js";
import { deletePortfolioFile } from "../controllers/Delete.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.delete("/student-file/:fileId", auth, deleteStudentFile);
router.delete("/portfolio/:fileId", auth, deletePortfolioFile);

export default router;
