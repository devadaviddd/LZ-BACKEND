import express from "express";
import { getServerName } from "../api/default.api.js";

const router = express.Router();
router.get('/', getServerName)

export const appRouter = router;