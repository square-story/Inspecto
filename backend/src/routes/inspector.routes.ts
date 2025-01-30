import { Router } from "express";
import { InspectorAuthController } from "../controllers/auth/inspector.auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { InspectorController } from "../controllers/inspector.controller";

const router = Router()

//inspector auth routes
router.post('/login', InspectorAuthController.inspectorLogin)
router.post('/refresh', InspectorAuthController.refreshToken)
router.post('/register', InspectorAuthController.registerInspector)
router.post('/verify-otp', InspectorAuthController.verifyOTP)
router.post('/resend-otp', InspectorAuthController.resendOTP)
router.post('/forget', InspectorAuthController.forgetPassword)
router.post('/reset', InspectorAuthController.resetPassword)
router.get('/details', authenticateToken, authorizeRole('inspector'), InspectorController.getInspectorDetails)
router.post('/complete-profile', authenticateToken, authorizeRole('inspector'), InspectorController.completeProfile)

//approval and rejection
router.patch('/approve/:inspectorId', authenticateToken, authorizeRole('admin'), InspectorController.approvalProfile)
router.post('/deny/:inspectorId', authenticateToken, authorizeRole('admin'), InspectorController.denyProfile)


export default router