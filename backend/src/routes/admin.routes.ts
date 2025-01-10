import { Router } from "express";
import { AdminAuthController } from "../controllers/auth/admin.auth.controller";


const router = Router()

router.post('/login', AdminAuthController.login)
router.post('/refresh', AdminAuthController.refreshToken)
router.post('/logout', AdminAuthController.logout); // Add logout route

export default router