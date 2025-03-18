import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TYPES } from "../di/types";
import { container } from "../di/container";
import { CloudinaryController } from "../controllers/cloudinary.controller";

const router = Router();
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken
const cloudinaryController = container.get<CloudinaryController>(TYPES.CloudinaryController)

router.get('/signed-url', authenticateToken, cloudinaryController.getSignedUrl)
router.get('/signed-pdf-url', authenticateToken, cloudinaryController.getSignedPdfUrl)

export default router;
