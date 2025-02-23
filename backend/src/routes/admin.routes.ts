import { Router } from "express";
import { AdminAuthController } from "../controllers/auth/admin.auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { AdminController } from "../controllers/admin.controller";
import { container } from "../di/container";
import { TYPES } from "../di/types";


const adminAuthController = container.get<AdminAuthController>(TYPES.AdminAuthController);
const adminController = container.get<AdminController>(TYPES.AdminController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const router = Router()

router.post('/login', (req, res) => adminAuthController.login(req, res))
router.post('/refresh', (req, res) => adminAuthController.refreshToken(req, res))
router.get('/get-inspectors', authMiddleware.authenticateToken, authorizeRole('admin'), (req, res) => adminController.getAllInspectors(req, res))
router.get('/get-users', authMiddleware.authenticateToken, authorizeRole('admin'), (req, res) => adminController.getAllUsers(req, res))

export default router