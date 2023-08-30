import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createProductAPI } from "../api/product/create-product.api.js";
import { getSellerProfileAPI } from "../api/seller/get-profile.api.js";

const router = express.Router();
router.post("/createProduct", authenticateUser, createProductAPI);
router.get("/profile", authenticateUser, getSellerProfileAPI);
export const sellerRouter = router;
