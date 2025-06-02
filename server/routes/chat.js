import express from "express";
import { getMessages } from "../controllers/Chat.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.get("/:roomId", auth, getMessages);

export default router;
