import express from "express";
import { newAccessToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.post("/", newAccessToken);

export default router;
