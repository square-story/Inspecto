import { IPaymentDocument, IPaymentInput } from "../../../models/payment.model";
import { IBaseService } from "./base/base.service.interface";

export interface IPaymentService extends IBaseService<IPaymentDocument> {
    createPayment(data: IPaymentInput): Promise<IPaymentDocument>;
    updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null>;
    getUserPayments(userId: string): Promise<IPaymentDocument[]>;
}