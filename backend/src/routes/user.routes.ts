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

router.post('/login', (req, res) => userAuthController.login(req, res))
router.post('/refresh', (req, res) => userAuthController.refreshToken(req, res))
router.post('/register', (req, res) => userAuthController.register(req, res))
router.post('/verify-otp', (req, res) => userAuthController.verifyOTP(req, res))
router.post('/resend-otp', (req, res) => userAuthController.resendOTP(req, res))
router.post('/google/callback', (req, res) => userAuthController.googleLogin(req, res))
router.post('/forget', (req, res) => userAuthController.forgetPassword(req, res))
router.post('/reset', (req, res) => userAuthController.resetPassword(req, res))
router.get('/details', authenticateToken, authorizeRole('user'), (req, res) => userController.getUserDetails(req, res))
router.put('/update', authenticateToken, authorizeRole('user'), (req, res) => userController.updateUserDetails(req, res))

//block/unblock
router.patch('/block/:userId', authenticateToken, authorizeRole('admin'), (req, res) => userController.updateStatus(req, res))
//change password
router.put('/change-password', authenticateToken, authorizeRole("user"), (req, res) => userController.changePassword(req, res))

export default router