import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";


const router = express.Router();
export const sellerRouter = router;