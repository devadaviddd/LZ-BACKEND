import { getCategoryByIdAPI } from "../api/category/get-category-by-id.api.js";
import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";
import { getAllProductsLatestAPI } from "../api/product/get-all-product-latest.api.js";
import express from "express";

const router = express.Router();
router.get("/category/:id", getCategoryByIdAPI);
router.get("/category", getAllCategoryTreeAPI);
router.get("/product", getAllProductsLatestAPI);

export const customerRouter = router;