import { getAvatarAPi } from "../api/user/get-avatar.api.js";
import { uploadAvatarAPI } from "../api/user/upload-avatar.api.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";
import express from "express";

const router = express.Router();
router.post("/upload", authenticateUser, uploadImage, uploadAvatarAPI);
router.get("/avatar/:id", authenticateUser, getAvatarAPi);
export const userRouter = router;
