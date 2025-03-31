import mongoose, { Document, Schema } from "mongoose";


export interface IReview {
    inspector: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    inspection: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface IReviewDocument extends IReview, Document { }

const ReviewSchema = new Schema<IReviewDocument>({
    inspector: {
        type: Schema.Types.ObjectId,
        ref: 'Inspector',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inspection: {
        type: Schema.Types.ObjectId,
        ref: 'Inspection',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

ReviewSchema.index({ inspection: 1 }, { unique: true })

export default mongoose.model<IReviewDocument>("Review", ReviewSchema)