import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { IReviewDocument } from "../models/review.model";
import { IReviewService } from "../core/interfaces/services/review.service.interface";
import { TYPES } from "../di/types";
import { IReviewRepository } from "../core/interfaces/repositories/review.repository.interface";
import { ServiceError } from "../core/errors/service.error";

injectable()
export class ReviewService extends BaseService<IReviewDocument> implements IReviewService {
    constructor(
        @inject(TYPES.ReviewRepository) private _reviewRepository: IReviewRepository
    ) {
        super(_reviewRepository)
    }
    async getInspectorRating(inspectorId: string): Promise<{ averageRating: number; totalReviews: number; }> {
        try {
            return await this._reviewRepository.getInspectorRating(inspectorId);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspector rating: ${error.message}`);
            }
            throw error;
        }
    }
}