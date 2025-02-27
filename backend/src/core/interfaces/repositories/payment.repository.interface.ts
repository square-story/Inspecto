import { IPaymentDocument, IPaymentInput, PaymentStatus } from "../../../models/payment.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IPaymentRepository extends BaseRepository<IPaymentDocument> {
    getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null>;
    findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]>;
    findUserPayments(userId: string): Promise<IPaymentDocument[]>;
    updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null>;
}