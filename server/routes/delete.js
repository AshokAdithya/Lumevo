import express from "express";
import { deleteStudentFile } from "../controllers/Upload.js";
import { deletePortfolioFile } from "../controllers/Delete.js";

const router = express.Router();

router.delete("/student-file/:fileId", deleteStudentFile);
router.delete("/portfolio/:fileId", deletePortfolioFile);

export default router;
