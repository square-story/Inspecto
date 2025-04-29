import { Request, Response } from "express";

export interface IReviewController {
    createReview: (req: Request, res: Response) => Promise<void>;
    getInspectorReviews: (req: Request, res: Response) => Promise<void>;
    getUserReviews: (req: Request, res: Response) => Promise<void>;
    getInspectionReview: (req: Request, res: Response) => Promise<void>;
    getInspectorRating: (req: Request, res: Response) => Promise<void>;
}