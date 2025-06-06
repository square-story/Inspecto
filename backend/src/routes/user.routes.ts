import { Router } from "express";
import { authorizeRole } from "../middlewares/role.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { IUserController } from "../core/interfaces/controllers/user.controller.interface";
import { IUserAuthController } from "../core/interfaces/controllers/auth.controller.interface";

const userController = container.get<IUserController>(TYPES.UserController)
const userAuthController = container.get<IUserAuthController>(TYPES.UserAuthController)
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
router.get('/dashboard', authenticateToken, authorizeRole('user'), userController.getUserDashboard)

//block/unblock
router.patch('/block/:userId', authenticateToken, authorizeRole('admin'), userController.updateStatus)
//change password
router.put('/change-password', authenticateToken, authorizeRole("user"), userController.changePassword)

export default router