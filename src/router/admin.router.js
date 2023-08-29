import express from "express";
import { createAdminAPI } from "../api/admin/create-admin.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createCategoryAPI } from "../api/category/create-category.api.js";
import { createSubCategoryAPI } from "../api/category/create-subcategory.api.js";
import { updateCategoryAPI } from "../api/category/update-category.api.js";
import { getAllCategoryAPI } from "../api/category/get-all-category.api.js";
import { getAllSellerAPI } from "../api/admin/get-all-seller.api.js";
import { deleteCategoryAPI } from "../api/category/delete-category.api.js";
import { rejectSellerAPI } from "../api/admin/reject-seller.api.js";
import { approveSellerAPI } from "../api/admin/approve-seller.api.js";


const router = express.Router();
router.post("/create", authenticateUser, createAdminAPI);
router.patch("/category/:id", authenticateUser, updateCategoryAPI);
router.post("/category/:id", authenticateUser, createSubCategoryAPI);
router.delete("/category/:id", authenticateUser, deleteCategoryAPI);
router.post("/category", authenticateUser, createCategoryAPI);
router.get("/category", authenticateUser, getAllCategoryAPI);
router.get("/seller", authenticateUser, getAllSellerAPI);
router.post("/reject-seller/:sellerId", authenticateUser, rejectSellerAPI);
router.post("/approve-seller/:sellerId", authenticateUser, approveSellerAPI);
export const adminRouter = router;
