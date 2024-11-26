import express from "express";
import {
  passwordReset,
  passwordResetLink,
  resetUrlCheck,
} from "../controllers/passwordReset.js";

const router = express.Router();

router.post("/", passwordResetLink);

router.get("/:id/:token", resetUrlCheck);

router.post("/:id/:token", passwordReset);

export default router;
