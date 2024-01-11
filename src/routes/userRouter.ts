import {
  requestPasswordReset,
  loginUser,
  registerUser,
  verifiedEmail,
  resetPassword,
} from "../controller/authController";
import express from "express";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify-email", verifiedEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
