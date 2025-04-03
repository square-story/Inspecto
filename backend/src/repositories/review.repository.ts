import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import reviewModel, { IReviewDocument } from "../models/review.model";
import { IReviewRepository } from "../core/interfaces/repositories/review.repository.interface";
import mongoose from "mongoose";


@injectable()
export class ReviewRepository extends BaseRepository<IReviewDocument> implements IReviewRepository {
    constructor() {
        super(reviewModel)
    }
    async getInspectorRating(inspectorId: string): Promise<{ averageRating: number; totalReviews: number; }> {
        const result = await this.model.aggregate([
            { $match: { inspector: new mongoose.Types.ObjectId(inspectorId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        return {
            averageRating: result[0].averageRating,
            totalReviews: result[0].totalReviews
        };
    }
}