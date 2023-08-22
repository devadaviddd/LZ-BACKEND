import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";
import express from "express";

const router = express.Router();
router.get("/category", getAllCategoryTreeAPI);

export const customerRouter = router;