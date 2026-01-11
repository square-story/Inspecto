import { Router } from "express";
import { IWithDrawalController } from "../core/interfaces/controllers/withdrawal.controller.interface";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const withdrawalController = container.get<IWithDrawalController>(TYPES.WithdrawalContoller)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

const withdrawalRoutes = Router();

withdrawalRoutes.post('/inspector/request', authenticateToken, authorizeRole('inspector'), withdrawalController.requestWithdrawal)
withdrawalRoutes.get('/inspector/history', authenticateToken, authorizeRole('inspector'), withdrawalController.getInspectorWithdrawals)
withdrawalRoutes.get('/admin/all', authenticateToken, authorizeRole('admin'), withdrawalController.getAllWithdrawals)
withdrawalRoutes.post('/admin/:withdrawalId/process', authenticateToken, authorizeRole('admin'), withdrawalController.processWithdrawal)


export default withdrawalRoutes;
