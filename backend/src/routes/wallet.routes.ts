import express from 'express';
import { Router } from 'express';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { IWalletController } from '../core/interfaces/controllers/wallet.controller.interface';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const walletRoutes: Router = express.Router();

const walletController = container.get<IWalletController>(TYPES.WalletController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

// Get Inspector wallet stats
walletRoutes.get('/inspector/stats', authenticateToken, walletController.getWalletStatsAboutInspector);

// Get Admin Wallet Stats
walletRoutes.get('/admin/stats', authenticateToken, walletController.getWalletStatsAboutAdmin)


// // Get wallet balance
// router.get('/balance', authenticateToken, walletController.getBalance);

// // Get transaction history
// router.get('/transactions', authenticateToken, walletController.getTransactions);

// // Add funds to wallet
// router.post('/deposit', authenticateToken, walletController.deposit);

// // Withdraw funds from wallet
// router.post('/withdraw', authenticateToken, walletController.withdraw);

// // Transfer funds between wallets
// router.post('/transfer', authenticateToken, walletController.transfer);

export default walletRoutes;
