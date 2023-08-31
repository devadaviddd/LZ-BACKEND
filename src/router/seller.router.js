import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createProductAPI } from "../api/product/create-product.api.js";
import { getSellerProfileAPI } from "../api/seller/get-profile.api.js";
import { uploadProductImage } from "../middleware/product-image.middeware.js";
import { uploadProductImageAPI } from "../api/product/upload-image.api.js";
import { getProductImageAPI } from "../api/product/get-image.api.js";
import { getProductAPI } from "../api/product/get-product.api.js";

const router = express.Router();
router.post("/product", authenticateUser, createProductAPI);
router.post(
  "/product/upload/:id",
  authenticateUser,
  uploadProductImage,
  uploadProductImageAPI
);
router.get("/product/image/:id", getProductImageAPI);
router.get("/product/:id", getProductAPI);
router.get("/profile", authenticateUser, getSellerProfileAPI);
export const sellerRouter = router;
