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

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/google", googleAuth);

router.delete("/logout", logout);

router.get("/:id/verify/:token", verify);

router.post("/expert-request", expertRequests);

router.post("/admin/create-expert", adminCreateExpert);

router.get("/admin/requests", getExpertRequest);

router.post("/admin/reject-request/:email", adminRejectExpert);

export default router;
