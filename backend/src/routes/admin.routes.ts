import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { IAdminAuthController } from "../core/interfaces/controllers/auth.controller.interface";
import { IAdminController } from "../core/interfaces/controllers/admin.controller.interface";


const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController);
const adminController = container.get<IAdminController>(TYPES.AdminController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const router = Router()

router.post('/login', adminAuthController.login)
router.post('/refresh', adminAuthController.refreshToken)
router.get('/get-inspectors', authMiddleware.authenticateToken, authorizeRole('admin'), adminController.getAllInspectors)
router.get('/get-users', authMiddleware.authenticateToken, authorizeRole('admin'), adminController.getAllUsers)

export default router