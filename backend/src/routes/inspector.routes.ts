import { Router } from "express";
import { InspectorAuthController } from "../controllers/auth/inspector.auth.controller";

const router = Router()

//inspector auth routes
router.post('/login', InspectorAuthController.inspectorLogin)
router.post('/refresh', InspectorAuthController.refreshToken)
router.post('/register', InspectorAuthController.registerInspector)
router.post('/verify-otp', InspectorAuthController.verifyOTP)
router.post('/resend-otp', InspectorAuthController.resendOTP)
router.post('/forget', InspectorAuthController.forgetPassword)
router.post('/reset', InspectorAuthController.resetPassword)


export default router