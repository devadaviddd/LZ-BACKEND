import { getCategoryByIdAPI } from "../api/category/get-category-by-id.api.js";
import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";
import { getAllProductsLatestAPI } from "../api/product/get-all-product-latest.api.js";
import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { getCustomerProfileAPI } from "../api/customer/get-profile.api.js";

const router = express.Router();
router.get("/category/:id", getCategoryByIdAPI);
router.get("/category", getAllCategoryTreeAPI);
router.get("/product", getAllProductsLatestAPI);
router.get("/profile", authenticateUser, getCustomerProfileAPI);

export const customerRouter = router;
