import { inject, injectable } from "inversify";
import { IReviewController } from "../core/interfaces/controllers/review.controller.interface";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { IReviewService } from "../core/interfaces/services/review.service.interface";
import { ServiceError } from "../core/errors/service.error";

injectable()
export class ReviewController implements IReviewController {

    constructor(
        @inject(TYPES.ReviewService) private _reviewService: IReviewService
    ) {

    }

    createReview = async (req: Request, res: Response) => {
        try {
            const data = req.body
            const response = await this._reviewService.create(data)
            res.status(200).json({ message: 'Review Successfully Added', review: response, success: true, })
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

    getInspectionReview = async (req: Request, res: Response) => {
        try {
            const { inspectionId } = req.params
            if (!inspectionId) {
                res.status(400).json({ success: false, message: 'Inspection Id Required' })
            }
            const response = await this._reviewService.findOne({ inspection: inspectionId })
            if (!response) {
                res.status(400).json({ success: true, message: 'Didn\'t get Inspection Review' })
            }
            res.status(200).json(response)
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

    getInspectorReviews = async (req: Request, res: Response) => {
        try {
            const inspectorId = req.user?.userId
            if (!inspectorId) {
                res.status(400).json({ message: 'Inspector Id Needed', success: false })
            }
            const response = await this._reviewService.find({ inspector: inspectorId })
            res.status(200).json({ data: response, message: "Inspector Review Featched Successfully", success: true })
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

    getInspectorRating = async (req: Request, res: Response) => {
        try {
            const { inspectorId } = req.body

            if (!inspectorId) {
                res.status(400).json({ message: 'inspectorId not Found', success: false })
            }

            const response = await this._reviewService.getInspectorRating(inspectorId)
            res.status(200).json({ success: true, data: response })

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

    getUserReviews = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body
            if (!userId) {
                res.status(400).json({
                    message: "UserId Not Found",
                    success: false
                })
            }
            const data = await this._reviewService.find({ user: userId })
            res.status(200).json({ message: 'User Review Featched Successfully', reviews: data, success: true })
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

}