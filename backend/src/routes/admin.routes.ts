import { Router } from "express";
import { AdminAuthController } from "../controllers/auth/admin.auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { AdminController } from "../controllers/admin.controller";


const router = Router()

router.post('/login', AdminAuthController.login)
router.post('/refresh', AdminAuthController.refreshToken)
router.get('/get-inspectors', authenticateToken, authorizeRole('admin'), AdminController.getAllInspectors)
router.get('/get-users', authenticateToken, authorizeRole('admin'), AdminController.getAllUsers)

export default router