import { IPaymentDocument, IPaymentInput, PaymentStatus } from "../../../models/payment.model";
import { BaseRepository } from "../../abstracts/base.repository";
import { IInspectionStatesFromPaymentDB } from "../../types/inspection.stats.type";

export interface IPaymentRepository extends BaseRepository<IPaymentDocument> {
    getPaymentByIntentId(paymentIntentId: string): Promise<IPaymentDocument | null>;
    findStalePayments(status: PaymentStatus, beforeDate: Date): Promise<IPaymentDocument[]>;
    findUserPayments(userId: string): Promise<IPaymentDocument[]>;
    updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null>;
    getInspectionStats(inspectorId: string): Promise<IInspectionStatesFromPaymentDB>;
    findPendingByInspection(inspectionId: string): Promise<IPaymentDocument[]>;
}