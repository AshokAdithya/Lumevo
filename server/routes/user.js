import express from "express";
import { auth } from "../middleware/Auth.js";
import { adminUserCheck, updateProfile } from "../controllers/User.js";

const router = express.Router();

router.get("/:token", auth, adminUserCheck);

router.put("/profile/:profileId", updateProfile);

export default router;
