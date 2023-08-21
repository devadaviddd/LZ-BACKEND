import express from "express";
import { signUpAPI } from "../api/auth/signup.api.js";
import { loginAPI } from "../api/auth/login.api.js";

const router = express.Router();
router.post("/signup", signUpAPI);
router.post("/login", loginAPI);

export const authRouter = router;