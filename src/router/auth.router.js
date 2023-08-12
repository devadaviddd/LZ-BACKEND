import express from "express";
import { signUpAPI } from "../api/auth/signup.api.js";

const router = express.Router();
router.post("/", signUpAPI);

export const authRouter = router;