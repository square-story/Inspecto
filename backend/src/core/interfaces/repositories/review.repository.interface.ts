import { IReviewDocument } from "../../../models/review.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IReviewRepository extends BaseRepository<IReviewDocument> {
    getInspectorRating(inspectorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
};