import express from "express";
import { createAdminAPI } from "../api/admin/create-admin.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createCategoryAPI } from "../api/category/create-category.api.js";
import { getAllCategoryTreeAPI } from "../api/category/get-category-tree.api.js";
import { createSubCategoryAPI } from "../api/category/create-subcategory.api.js";
import { updateCategoryAPI } from "../api/category/update-category.api.js";

const router = express.Router();
router.post("/create", authenticateUser, createAdminAPI);
router.patch("/category/:id", authenticateUser, updateCategoryAPI);
router.post("/category/:id", authenticateUser, createSubCategoryAPI);
router.post("/category", authenticateUser, createCategoryAPI);
router.get("/category", authenticateUser, getAllCategoryTreeAPI);

export const adminRouter = router;
