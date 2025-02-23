import { IPaymentDocument, IPaymentInput, PaymentStatus } from "../../../models/payment.model";

export interface IPaymentRepository {
    createPayment(data: IPaymentInput): Promise<IPaymentDocument>;
    updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null>;
    getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null>;
    findUserPayments(userId: string): Promise<IPaymentDocument[]>;
    findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]>;
}