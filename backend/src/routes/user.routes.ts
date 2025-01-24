import { Router } from "express";
import { UserAuthController } from "../controllers/auth/user.auth.controller";
import { UserController } from "../controllers/user.controller";
import { authorizeRole } from "../middlewares/role.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router()

router.post('/login', UserAuthController.userLogin)
router.post('/refresh', UserAuthController.refreshToken)
router.post('/register', UserAuthController.registerUser)
router.post('/verify-otp', UserAuthController.verifyOTP)
router.post('/resend-otp', UserAuthController.resendOTP)
router.post('/google/callback', UserAuthController.googleAuth)
router.post('/forget', UserAuthController.forgetPassword)
router.post('/reset', UserAuthController.resetPassword)
router.get('/details', authenticateToken, authorizeRole('user'), UserController.getUserDetails)

export default router