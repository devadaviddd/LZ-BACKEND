import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createProductAPI } from "../api/seller/create-product.api.js";


const router = express.Router();
router.post("/createProduct", authenticateUser, createProductAPI);
export const sellerRouter = router;