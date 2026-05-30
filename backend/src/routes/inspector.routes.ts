import { Router } from "express";
import { authorizeRole } from "../middlewares/role.middleware";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { IInspectorAuthController } from "../core/interfaces/controllers/auth.controller.interface";
import { IInspectorController } from "../core/interfaces/controllers/inspector.controller.interface";
import { validate } from "../middlewares/validation.middleware";
import {
    inspectorLoginSchema,
    inspectorRegisterSchema,
    verifyOTPSchema,
    resendOTPSchema,
    forgetPasswordSchema,
    resetPasswordSchema
} from "../validators/auth.validator";

const router = Router()

const inspectorController = container.get<IInspectorController>(TYPES.InspectorController)
const inspectorAuthController = container.get<IInspectorAuthController>(TYPES.InspectorAuthController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken


//inspector auth routes with validation
router.post('/login', validate(inspectorLoginSchema), inspectorAuthController.login);
router.post('/refresh', inspectorAuthController.refreshToken)
router.post('/register', validate(inspectorRegisterSchema), inspectorAuthController.register)
router.post('/verify-otp', validate(verifyOTPSchema), inspectorAuthController.verifyOTP)
router.post('/resend-otp', validate(resendOTPSchema), inspectorAuthController.resendOTP)
router.post('/forget', validate(forgetPasswordSchema), inspectorAuthController.forgetPassword)
router.post('/reset', validate(resetPasswordSchema), inspectorAuthController.resetPassword)
router.get('/details', authenticateToken, authorizeRole('inspector'), inspectorController.getInspectorDetails)
router.post('/complete-profile', authenticateToken, authorizeRole('inspector'), inspectorController.completeProfile)

//approval and rejection
router.patch('/approve/:inspectorId', authenticateToken, authorizeRole('admin'), inspectorController.approvalProfile)
router.post('/deny/:inspectorId', authenticateToken, authorizeRole('admin'), inspectorController.denyProfile)

//block and unblock
router.patch('/block/:inspectorId', authenticateToken, authorizeRole('admin'), inspectorController.handleBlock)

//updates
router.put('/update', authenticateToken, authorizeRole('inspector'), inspectorController.updateInspector)
//change password
router.put('/change-password', authenticateToken, authorizeRole('inspector'), inspectorController.changePassword)

router.get('/', inspectorController.getNearbyInspectors)

router.get('/dashboard', authenticateToken, authorizeRole('inspector'), inspectorController.getInspectorDashboardStats)


export default router