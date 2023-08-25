import express from "express";
import { createAdminAPI } from "../api/admin/create-admin.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createCategoryAPI } from "../api/category/create-category.api.js";
import { createSubCategoryAPI } from "../api/category/create-subcategory.api.js";
import { updateCategoryAPI } from "../api/category/update-category.api.js";
import { getAllCategoryAPI } from "../api/category/get-all-category.api.js";
import { getAllSeller } from "../api/admin/get-all-seller-api.js";
import { getCategoryByIdAPI } from "../api/category/get-category-by-id.api.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();
router.post("/create", authenticateUser, createAdminAPI);
router.patch("/category/:id", authenticateUser, updateCategoryAPI);
router.post("/category/:id", authenticateUser, createSubCategoryAPI);
router.post("/category", authenticateUser, createCategoryAPI);
router.get("/category", authenticateUser, getAllCategoryAPI);
router.get("/seller", authenticateUser, getAllSeller);
router.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
});
export const adminRouter = router;
