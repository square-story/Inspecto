import { IReviewDocument } from "../../../models/review.model";
import { IBaseService } from "./base/base.service.interface";

export interface IReviewService extends IBaseService<IReviewDocument> {
    getInspectorRating(inspectorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}