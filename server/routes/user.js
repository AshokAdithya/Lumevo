import express from "express";
import { auth } from "../middleware/Auth.js";
import { adminUserCheck, updateProfile } from "../controllers/User.js";

const router = express.Router();

router.get("/access", auth, adminUserCheck);

router.put("/profile/:profileId", auth, updateProfile);

export default router;
