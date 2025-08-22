import { Router } from "express";
import { authorizeRole } from "../middlewares/role.middleware";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { IInspectionController } from "../core/interfaces/controllers/inspection.controller.interface";

const router = Router();

const inspectionController = container.get<IInspectionController>(TYPES.InspectionController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken


//get all inspections
router.get('/', authenticateToken, authorizeRole('user', 'inspector'), inspectionController.findInspections)

router.get('/get-stats', authenticateToken, authorizeRole('inspector'), inspectionController.getInspectorStates);


router.post("/book", authenticateToken, authorizeRole('user'), inspectionController.createInspection);

router.put('/update', authenticateToken, authorizeRole('user'), inspectionController.updateInspection)

router.get('/available-slots/:inspectorId/:date', authenticateToken, authorizeRole('user'), inspectionController.getAvailableSlots);

router.post('/submit-report', authenticateToken, authorizeRole('inspector'), inspectionController.submitInspectionReport);

//get single inspections
router.get('/:inspectionId', authenticateToken, authorizeRole('user'), inspectionController.getInspectionById)


export default router;