import { injectable } from "inversify";
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";
import paymentModel, { IPaymentInput, IPaymentDocument, PaymentStatus } from "../models/payment.model";
import { BaseRepository } from "../core/abstracts/base.repository";

@injectable()
export class PaymentRepository extends BaseRepository<IPaymentDocument> implements IPaymentRepository {
    constructor() {
        super(paymentModel)
    }
    async createPayment(data: Partial<IPaymentInput>): Promise<IPaymentDocument> {
        return await this.create(data);
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
        }).populate('inspection').sort({ createdAt: -1 });
    }
    async findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]> {
        return await this.find({
            status: status,
            createdAt: { $lt: beforeDate }
        });
    }
}
