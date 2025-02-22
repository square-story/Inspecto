import paymentModel, { IPaymentInput, IPaymentDocument, PaymentStatus } from "../models/payment.model";
import { IPaymentRepository } from "./interfaces/payment.repository.interface";

class PaymentRepository implements IPaymentRepository {
    async createPayment(data: Partial<IPaymentInput>): Promise<IPaymentDocument> {
        const payment = new paymentModel(data);
        return await payment.save();
    }
    async getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null> {
        return await paymentModel.findOne({ stripePaymentIntentId: paymentIntentId });
    }
    async updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null> {
        return await paymentModel.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntentId },
            data,
            { new: true }
        );
    }
    async findUserPayments(userId: string): Promise<IPaymentDocument[]> {
        return await paymentModel.find({
            user: userId
        }).populate('inspection').sort({ createdAt: -1 });
    }
    async findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]> {
        return await paymentModel.find({
            status: status,
            createdAt: { $lt: beforeDate }
        });
    }
}

export default PaymentRepository;