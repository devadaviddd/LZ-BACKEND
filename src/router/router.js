import express from "express";
import { authRouter } from "./auth.router.js";
import { adminRouter } from "./admin.router.js";
import { customerRouter } from "./customer.router.js";
import { sellerRouter } from "./seller.router.js";
import { userRouter } from "./user.router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/customer", customerRouter);
router.use("/seller", sellerRouter);

export const API = router;
