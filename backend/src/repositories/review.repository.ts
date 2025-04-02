import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import reviewModel, { IReviewDocument } from "../models/review.model";
import { IReviewRepository } from "../core/interfaces/repositories/review.repository.interface";


@injectable()
export class ReviewRepository extends BaseRepository<IReviewDocument> implements IReviewRepository {
    constructor() {
        super(reviewModel)
    }
    getInspectorRating(inspectorId: string): Promise<{ averageRating: number; totalReviews: number; }> {
        throw new Error("Method not implemented.");
    }
}