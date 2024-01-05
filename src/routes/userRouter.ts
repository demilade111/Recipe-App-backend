import { loginUser, registerUser } from "../controller/UserController";
import express from "express";
const router = express.Router();

router.get("/login", loginUser);
router.post("/register", registerUser);

export default router;
