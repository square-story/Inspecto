import { IPaymentDocument, IPaymentInput } from "../../models/payment.model";

export interface IPaymentRepository {
    createPayment(data: IPaymentInput): Promise<IPaymentDocument>;
    updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null>;
    getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null>;
}