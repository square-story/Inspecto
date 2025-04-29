import {Router} from 'express'
import { container } from '../di/container'
import { TYPES } from '../di/types'
import { IInspectionTypeController } from '../core/interfaces/controllers/inspection-type.controller.interface'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { authorizeRole } from '../middlewares/role.middleware'


const inspectionTypeRoutes = Router()
const inspectionTypeController = container.get<IInspectionTypeController>(TYPES.InspectionTypeController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken


//public route
inspectionTypeRoutes.get('/active',inspectionTypeController.getActiveInspectionTypes)

//admin only routes
inspectionTypeRoutes.get('/',authenticateToken,authorizeRole('admin'),inspectionTypeController.getAllInspectionTypes)
inspectionTypeRoutes.get('/:id',authenticateToken,authorizeRole('admin'),inspectionTypeController.getInspectionTypeById)
inspectionTypeRoutes.post('/',authenticateToken,authorizeRole('admin'),inspectionTypeController.createInspectionType)
inspectionTypeRoutes.put('/:id',authenticateToken,authorizeRole('admin'),inspectionTypeController.updateInspectionType)
inspectionTypeRoutes.patch('/:id/toggle-status',authenticateToken,authorizeRole('admin'),inspectionTypeController.toggleInspectionTypeStatus)
inspectionTypeRoutes.delete('/:id',authenticateToken,authorizeRole('admin'),inspectionTypeController.deleteInspectionType)

export default inspectionTypeRoutes



