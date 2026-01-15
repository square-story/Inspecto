import { inject, injectable } from "inversify";
import { IReviewController } from "../core/interfaces/controllers/review.controller.interface";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { IReviewService } from "../core/interfaces/services/review.service.interface";
import { ServiceError } from "../core/errors/service.error";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";

injectable()
export class ReviewController implements IReviewController {

    constructor(
        @inject(TYPES.ReviewService) private _reviewService: IReviewService
    ) {

    }

    createReview = async (req: Request, res: Response) => {
        try {
            const data = req.body
            if (!data) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Data Not Found' })
                return
            }
            const response = await this._reviewService.createReview(data)
            res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGES.SUCCESS.CREATED, review: response, success: true, })
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

    getInspectionReview = async (req: Request, res: Response) => {
        try {
            const { inspectionId } = req.params
            if (!inspectionId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Inspection Id Required' })
                return;
            }
            const response = await this._reviewService.findReviewsByInspection(inspectionId)
            if (!response) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ success: true, message: 'Didn\'t get Inspection Review' })
                return;
            }
            res.status(HTTP_STATUS.OK).json(response)
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

    getInspectorReviews = async (req: Request, res: Response) => {
        try {
            const { inspectorId } = req.params
            if (!inspectorId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_ID_MISSING, success: false })
                return
            }
            const response = await this._reviewService.findReviewsByInspector(inspectorId)
            res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGES.SUCCESS.FETCHED, data: response, success: true })
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

    getInspectorRating = async (req: Request, res: Response) => {
        try {
            const { inspectorId } = req.params

            if (!inspectorId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_ID_MISSING, success: false })
                return
            }

            const response = await this._reviewService.getInspectorRating(inspectorId)
            res.status(HTTP_STATUS.OK).json({ success: true, data: response })

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

    getUserReviews = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "UserId Not Found",
                    success: false
                })
            }
            const data = await this._reviewService.findReviewsByUser(userId)
            res.status(HTTP_STATUS.OK).json({ message: 'User Review Featched Successfully', reviews: data, success: true })
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

}