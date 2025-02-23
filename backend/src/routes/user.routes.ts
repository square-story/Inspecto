import { Router } from "express";
import { UserAuthController } from "../controllers/auth/user.auth.controller";
import { UserController } from "../controllers/user.controller";
import { authorizeRole } from "../middlewares/role.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { container } from "../di/container";
import { TYPES } from "../di/types";

const userController = container.get<UserController>(TYPES.UserController)
const userAuthController = container.get<UserAuthController>(TYPES.UserAuthController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

const router = Router()

router.post('/login', userAuthController.login)
router.post('/refresh', userAuthController.refreshToken)
router.post('/register', userAuthController.register)
router.post('/verify-otp', userAuthController.verifyOTP)
router.post('/resend-otp', userAuthController.resendOTP)
router.post('/google/callback', userAuthController.googleLogin)
router.post('/forget', userAuthController.forgetPassword)
router.post('/reset', userAuthController.resetPassword)
router.get('/details', authenticateToken, authorizeRole('user'), userController.getUserDetails)
router.put('/update', authenticateToken, authorizeRole('user'), userController.updateUserDetails)

//block/unblock
router.patch('/block/:userId', authenticateToken, authorizeRole('admin'), userController.updateStatus)
//change password
router.put('/change-password', authenticateToken, authorizeRole("user"), userController.changePassword)

export default router