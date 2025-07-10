import { IReview } from "../../../models/review.model";


export interface IReviewService {
    getInspectorRating(inspectorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
    createReview(data: Partial<IReview>): Promise<void>;
    findReviewsByInspection(inspectionId: string): Promise<IReview[]>;
    findReviewsByInspector(inspectorId: string): Promise<IReview[]>;
    findReviewsByUser(userId: string): Promise<IReview[]>;
}