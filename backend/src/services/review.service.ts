import { inject, injectable } from "inversify";
import { IReviewService } from "../core/interfaces/services/review.service.interface";
import { TYPES } from "../di/types";
import { IReviewRepository } from "../core/interfaces/repositories/review.repository.interface";
import { ServiceError } from "../core/errors/service.error";
import { IReview } from "../models/review.model";

injectable()
export class ReviewService implements IReviewService {
    constructor(
        @inject(TYPES.ReviewRepository) private _reviewRepository: IReviewRepository
    ) {
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

    async createReview(data: Partial<IReview>): Promise<void> {
        try {
            await this._reviewRepository.create(data);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error creating review: ${error.message}`);
            }
            throw error;
        }
    }

    async findReviewsByInspection(inspectionId: string): Promise<IReview[]> {
        try {
            return await this._reviewRepository.find({ inspection: inspectionId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding reviews by inspection: ${error.message}`);
            }
            throw error;
        }
    }

    async findReviewsByInspector(inspectorId: string): Promise<IReview[]> {
        try {
            return await this._reviewRepository.find({ inspector: inspectorId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding reviews by inspector: ${error.message}`);
            }
            throw error;
        }
    }

    async findReviewsByUser(userId: string): Promise<IReview[]> {
        try {
            return await this._reviewRepository.find({ user: userId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding reviews by user: ${error.message}`);
            }
            throw error;
        }
    }
}