import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IWalletService } from "../core/interfaces/services/wallet.service.interface";
import { IWalletController } from "../core/interfaces/controllers/wallet.controller.interface";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";

@injectable()
export class WalletController implements IWalletController {
    constructor(
        @inject(TYPES.WalletService) private _walletService: IWalletService
    ) { }

    getWalletStatsAboutInspector = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId;
            if (!inspectorId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }

            const response = await this._walletService.getWalletStatsAboutInspector(inspectorId);

            if (!response) {
                res.status(404).json({
                    success: false,
                    message: 'Wallet stats not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                response,
            });

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    getWalletStatsAboutAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const adminId = req.user?.userId;

            if (!adminId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                })
                return;
            }

            const response = await this._walletService.getWalletStatsAboutAdmin()

            if (!response) {
                res.status(404).json({
                    success: false,
                    message: 'Wallet stats not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                response,
            });

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    };

    getWalletStatsAboutUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                })
                return;
            }

            const response = await this._walletService.getWalletStatsAboutUser(userId)

            if (!response) {
                res.status(404).json({
                    success: false,
                    message: 'Wallet stats not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                response,
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
}
