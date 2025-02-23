import { Router } from "express";
import { authorizeRole } from "../middlewares/role.middleware";
import { container } from "../di/container";
import { InspectorController } from "../controllers/inspector.controller";
import { TYPES } from "../di/types";
import { InspectorAuthController } from "../controllers/auth/inspector.auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router()

const inspectorController = container.get<InspectorController>(TYPES.InspectorController)
const inspectorAuthController = container.get<InspectorAuthController>(TYPES.InspectorAuthController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken


//inspector auth routes
router.post('/login', (req, res) => inspectorAuthController.login(req, res))
router.post('/refresh', (req, res) => inspectorAuthController.refreshToken(req, res))
router.post('/register', (req, res) => inspectorAuthController.register(req, res))
router.post('/verify-otp', (req, res) => inspectorAuthController.verifyOTP(req, res))
router.post('/resend-otp', (req, res) => inspectorAuthController.resendOTP(req, res))
router.post('/forget', (req, res) => inspectorAuthController.forgetPassword(req, res))
router.post('/reset', (req, res) => inspectorAuthController.resetPassword(req, res))
router.get('/details', authenticateToken, authorizeRole('inspector'), (req, res) => inspectorController.getInspectorDetails(req, res))
router.post('/complete-profile', authenticateToken, authorizeRole('inspector'), (req, res) => inspectorController.completeProfile(req, res))

//approval and rejection
router.patch('/approve/:inspectorId', authenticateToken, authorizeRole('admin'), (req, res) => inspectorController.approvalProfile(req, res))
router.post('/deny/:inspectorId', authenticateToken, authorizeRole('admin'), (req, res) => inspectorController.denyProfile(req, res))

//block and unblock
router.patch('/block/:inspectorId', authenticateToken, authorizeRole('admin'), (req, res) => inspectorController.handleBlock(req, res))

//updates
router.put('/update', authenticateToken, authorizeRole('inspector'), inspectorController.updateInspector)
//change password
router.put('/change-password', authenticateToken, authorizeRole('inspector'), (req, res) => inspectorController.changePassword(req, res))

router.get('/', (req, res) => inspectorController.getNearbyInspectors(req, res))


export default router