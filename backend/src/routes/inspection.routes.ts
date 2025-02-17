import { NextFunction, Request, Response, Router } from "express";
import InspectionController from "../controllers/inspection.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router = Router();
const inspectionController = new InspectionController();


//get all inspections
router.get('/', authenticateToken, authorizeRole('user'), (req: Request, res: Response, next: NextFunction) => {
    inspectionController.findInspections(req, res).catch(next)
})

//get single inspections
router.get('/:inspectionId', authenticateToken, authorizeRole('user'), (req: Request, res: Response, next: NextFunction) => {
    inspectionController.getInspectionById(req, res).catch(next)
})

router.post("/book", authenticateToken, authorizeRole('user'), (req: Request, res: Response, next: NextFunction) => {
    inspectionController
        .createInspection(req, res)
        .catch(next);
});

router.put('/update', authenticateToken, authorizeRole('user'), (req: Request, res: Response, next: NextFunction) => {
    inspectionController.updateInspection(req, res).catch(next)
})

router.get('/available-slots/:inspectorId/:date', authenticateToken, authorizeRole('user'), (req: Request, res: Response, next: NextFunction) => {
    inspectionController.getAvailableSlots(req, res).catch(next)
});



export default router;