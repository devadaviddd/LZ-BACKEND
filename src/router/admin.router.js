import express from "express";
import { createAdminAPI } from "../api/admin/create-admin.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createCategoryAPI } from "../api/category/create-category.api.js";
import { createSubCategoryAPI } from "../api/category/create-subcategory.api.js";
import { updateCategoryAPI } from "../api/category/update-category.api.js";
import { getAllCategory } from "../api/category/get-all-category.api.js";
import { getAllSeller } from "../api/admin/get-all-seller-api.js";

const router = express.Router();
router.post("/create", authenticateUser, createAdminAPI);
router.patch("/category/:id", authenticateUser, updateCategoryAPI);
router.post("/category/:id", authenticateUser, createSubCategoryAPI);
router.post("/category", authenticateUser, createCategoryAPI);
router.get("/category", authenticateUser, getAllCategory);
router.get("/seller", authenticateUser, getAllSeller);
export const adminRouter = router;
