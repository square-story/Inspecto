import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IWalletService } from "../core/interfaces/services/wallet.service.interface";
import { IWalletController } from "../core/interfaces/controllers/wallet.controller.interface";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";

@injectable()
export class WalletController implements IWalletController {
    constructor(
        @inject(TYPES.WalletService) private _walletService: IWalletService
    ) { }

    getWalletStatsAboutInspector = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId;
            if (!inspectorId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED
                });
                return;
            }

            const response = await this._walletService.getWalletStatsAboutInspector(inspectorId);

            if (!response) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.NOT_FOUND
                });
                return;
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                response,
            });

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    getWalletStatsAboutAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const adminId = req.user?.userId;

            if (!adminId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED
                })
                return;
            }

            const response = await this._walletService.getWalletStatsAboutAdmin()

            if (!response) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.NOT_FOUND
                });
                return;
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                response,
            });

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    };

    getWalletStatsAboutUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED
                })
                return;
            }

            const response = await this._walletService.getWalletStatsAboutUser(userId)

            if (!response) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.NOT_FOUND
                });
                return;
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                response,
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
}
