import { injectable } from "inversify";
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";
import paymentModel, { IPaymentInput, IPaymentDocument, PaymentStatus } from "../models/payment.model";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IInspectionStatesFromPaymentDB } from "../core/types/inspection.stats.type";
import { Types } from "mongoose";

@injectable()
export class PaymentRepository extends BaseRepository<IPaymentDocument> implements IPaymentRepository {
    constructor() {
        super(paymentModel)
    }
    async getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null> {
        return await this.findOne({ stripePaymentIntentId: paymentIntentId });
    }
    async updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null> {
        return await this.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntentId },
            data,
        );
    }
    async findUserPayments(userId: string): Promise<IPaymentDocument[]> {
        return await this.model.find({
            user: userId
        }).populate('inspection').populate('user').sort({ createdAt: -1 });
    }
    async findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]> {
        return await this.find({
            status: status,
            createdAt: { $lt: beforeDate }
        });
    }
    async getInspectionStats(inspectorId: string): Promise<IInspectionStatesFromPaymentDB> {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const totalEarningsResult = await this.model.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCEEDED
                }
            },
            {
                $lookup: {
                    from: "inspections",
                    localField: "inspection",
                    foreignField: "_id",
                    as: 'inspection'
                }
            },
            {
                $unwind: '$inspection'
            },
            {
                $match: {
                    'inspection.inspector': new Types.ObjectId(inspectorId)
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const thisMonthEarningsResult = await this.model.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCEEDED,
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $lookup: {
                    from: 'inspections',
                    localField: 'inspection',
                    foreignField: '_id',
                    as: 'inspection'
                }
            },
            {
                $unwind: '$inspection'
            },
            {
                $match: {
                    'inspection.inspector': new Types.ObjectId(inspectorId)
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalEarnings = totalEarningsResult[0]?.total || 0;
        const thisMonthEarnings = thisMonthEarningsResult[0]?.total || 0;

        return {
            thisMonthEarnings,
            totalEarnings
        }
    }
    async findPendingByInspection(inspectionId: string): Promise<IPaymentDocument[]> {
        return this.model.find({
            inspection: inspectionId,
            status: PaymentStatus.PENDING
        }).exec();
    }
}
