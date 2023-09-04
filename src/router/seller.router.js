import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createProductAPI } from "../api/product/create-product.api.js";
import { getSellerProfileAPI } from "../api/seller/get-profile.api.js";
import { uploadProductImage } from "../middleware/product-image.middeware.js";
import { uploadProductImageAPI } from "../api/product/upload-image.api.js";
import { getProductImageAPI } from "../api/product/get-image.api.js";
import { filterProductOrderBySellerAPI } from "../api/productOrder/filter-product-order-by-seller.api.js";
import { getSellerProductsAPI } from "../api/product/get-seller-product.api.js";
import { updateProductAPI } from "../api/product/update-product.api.js";
import { getProductByIdAPI } from "../api/product/get-product-by-id.api.js";
import { deleteProductAPI } from "../api/product/delete-product.api.js";
import { getAllCategoryAPI } from "../api/category/get-all-category.api.js";

const router = express.Router();
router.post("/product", authenticateUser, createProductAPI);
router.get("/product", authenticateUser, getSellerProductsAPI);
router.post(
  "/product/upload/:id",
  authenticateUser,
  uploadProductImage,
  uploadProductImageAPI
);
router.get("/category", authenticateUser, getAllCategoryAPI);
router.get("/product/image/:id", getProductImageAPI);
router.delete("/product/:id", authenticateUser, deleteProductAPI);
router.get("/product/:id", getProductByIdAPI);
router.patch("/product/:id", authenticateUser, updateProductAPI);
router.delete("/product/:id", authenticateUser, deleteProductAPI);
router.get("/profile", authenticateUser, getSellerProfileAPI);
router.get("/order/:id", authenticateUser, filterProductOrderBySellerAPI);
export const sellerRouter = router;
