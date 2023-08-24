import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createProductAPI } from "../api/product/create-product.api.js";


const router = express.Router();
export const sellerRouter = router;