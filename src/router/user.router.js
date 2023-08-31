import { getAvatarAPi } from "../api/user/get-avatar.api.js";
import { uploadAvatarAPI } from "../api/user/upload-avatar.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import express from "express";
import { uploadAvatarImage } from "../middleware/avatar.middleware.js";

const router = express.Router();
router.post("/upload", authenticateUser, uploadAvatarImage, uploadAvatarAPI);
router.get("/avatar/:id", authenticateUser, getAvatarAPi);
export const userRouter = router;
