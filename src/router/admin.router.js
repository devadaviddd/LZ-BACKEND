import express from "express";
import { createAdmin } from "../api/admin/create-admin.api.js";

const router = express.Router();
router.post("/create", createAdmin);

export const adminRouter = router;