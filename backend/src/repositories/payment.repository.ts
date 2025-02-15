import paymentModel, { IPaymentInput, IPaymentDocument } from "../models/payment.model";
import { IPaymentRepository } from "./interfaces/payment.repository.interface";

class PaymentRepository implements IPaymentRepository {
    async createPayment(data: IPaymentInput): Promise<IPaymentDocument> {
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
}

export default PaymentRepository;