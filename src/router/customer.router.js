import { getCategoryByIdAPI } from "../api/category/get-category-by-id.api.js";
import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";
import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { getCustomerProfileAPI } from "../api/customer/get-profile.api.js";
import { getAllAvailableProductsAPI } from "../api/product/get-all-product-latest.api.js";
import { createOrderAPI } from "../api/order/create-order.api.js";
import { getProductByCategoryIdAPI } from "../api/product/get-product-by-category.api.js";

const router = express.Router();
router.get("/category/:id", getCategoryByIdAPI);
router.get("/category", getAllCategoryTreeAPI);
router.get("/product", getAllAvailableProductsAPI);
router.get("/product/:categoryId", getProductByCategoryIdAPI);
router.get("/profile", authenticateUser, getCustomerProfileAPI);
router.post("/checkout", authenticateUser, createOrderAPI);
export const customerRouter = router;
