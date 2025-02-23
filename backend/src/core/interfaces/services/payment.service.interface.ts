import { IPaymentDocument, IPaymentInput } from "../../../models/payment.model";

export interface IPaymentService {
    createPayment(data: IPaymentInput): Promise<IPaymentDocument>;
    updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null>;
    getUserPayments(userId: string): Promise<IPaymentDocument[]>;
}