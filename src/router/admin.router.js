import express from "express";
import { createAdminAPI } from "../api/admin/create-admin.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createCategoryAPI } from "../api/category/create-category.api.js";
import { createSubCategoryAPI } from "../api/category/create-subcategory.api.js";
import { updateCategoryAPI } from "../api/category/update-category.api.js";
import { getAllCategoryAPI } from "../api/category/get-all-category.api.js";
import { getAllSeller } from "../api/admin/get-all-seller-api.js";
import { rejectSeller } from "../api/admin/reject-seller.api.js";
import { approveSeller } from "../api/admin/approve-seller.api.js";
import { getCategoryByIdAPI } from "../api/category/get-category-by-id.api.js";
import { uploadUser } from "../middleware/upload.middleware.js";
import { uploadAdminAvatar } from "../api/admin/upload-image.api.js";


const router = express.Router();
router.post("/create", authenticateUser, createAdminAPI);
router.patch("/category/:id", authenticateUser, updateCategoryAPI);
router.post("/category/:id", authenticateUser, createSubCategoryAPI);
router.post("/category", authenticateUser, createCategoryAPI);
router.get("/category", authenticateUser, getAllCategoryAPI);
router.get("/seller", authenticateUser, getAllSeller);
router.post("/reject-seller/:sellerId", authenticateUser, rejectSeller);
router.post("/approve-seller/:sellerId", authenticateUser, approveSeller);
router.post("/upload", uploadUser.single("file"), uploadAdminAvatar);
export const adminRouter = router;
