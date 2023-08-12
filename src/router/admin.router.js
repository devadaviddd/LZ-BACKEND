import express from "express";
import { createAdminAPI } from "../api/admin/create-admin.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/create", authenticateUser, createAdminAPI);

export const adminRouter = router;