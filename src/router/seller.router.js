import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";


const router = express.Router();
router.get("/category", authenticateUser, getAllCategoryTreeAPI);
export const sellerRouter = router;