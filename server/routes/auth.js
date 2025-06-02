import express from "express";
import {
  signUp,
  signIn,
  verify,
  logout,
  googleAuth,
  expertRequests,
  adminCreateExpert,
  getExpertRequest,
  adminRejectExpert,
} from "../controllers/Auth.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", googleAuth);

router.get("/:id/verify/:token", verify);
router.post("/expert-request", expertRequests);

// Protected routes using new 'auth' middleware
router.post("/logout", auth, logout);

router.post("/admin/create-expert", auth, adminCreateExpert);
router.get("/admin/requests", auth, getExpertRequest);
router.post("/admin/reject-request/:email", auth, adminRejectExpert);
export default router;
