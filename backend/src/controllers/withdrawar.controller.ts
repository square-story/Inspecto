import { inject, injectable } from "inversify";
import { IWithDrawalController } from "../core/interfaces/controllers/withdrawal.controller.interface";
import { TYPES } from "../di/types";
import { IWithDrawalService } from "../core/interfaces/services/withdrawal.service.interface";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";
import { HTTP_STATUS } from "../constants/http/status-codes";

injectable()
export class WithdrawalController implements IWithDrawalController {
    constructor(
        @inject(TYPES.WithdrawalService) private _withdrawalService: IWithDrawalService
    ) {

    }

    getPendingWithdrawals = async (req: Request, res: Response): Promise<void> => {
        try {
            const withdrawal = await this._withdrawalService.getPendingWithdrawals();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                withdrawal
            })
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
                    message: 'Internal server error',
                });
            }
        }
    }

    getInspectorWithdrawals = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId
            const withdrawal = await this._withdrawalService.getInspectorWithdrawals(inspectorId as string)

            res.json({
                success: true,
                withdrawal
            })
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
                    message: 'Internal server error',
                });
            }
        }
    };

    getAllWithdrawals = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;

            const response = await this._withdrawalService.getAllWithdrawals(page, limit, status);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                ...response
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    }

    processWithdrawal = async (req: Request, res: Response): Promise<void> => {
        const { withdrawalId } = req.params;
        const { action, remarks } = req.body;
        await this._withdrawalService.ProcessWithdrawal(withdrawalId, action, remarks);
        res.json({
            success: true,
            message: `Withdrawal ${action}ed successfully`
        });
    };

    requestWithdrawal = async (req: Request, res: Response): Promise<void> => {
        try {
            const { amount, method, paymentDetails } = req.body;
            const inspectorId = req.user?.userId;

            if (!inspectorId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }

            const withdrawal = await this._withdrawalService.requestWithdrawal(
                inspectorId,
                Number(amount),
                method,
                paymentDetails
            );

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Withdrawal request created successfully',
                withdrawal
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message
                });
            } else {
                console.error('Withdrawal request error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    };
}