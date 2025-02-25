import { IPaymentDocument, PaymentStatus } from "../../../models/payment.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IPaymentRepository extends BaseRepository<IPaymentDocument> {
    getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null>;
    findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]>;
}