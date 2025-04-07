import { IBankDetails, IWithdrawal, WithdrawalMethod } from "../../../models/withdrawal.model";
import { IBaseService } from "./base/base.service.interface";

export interface IWithDrawalService extends IBaseService<IWithdrawal> {
    requestWithdrawal(inspectorId: string, amount: number, method: WithdrawalMethod, paymentDetails: { upiId?: string, bankDetails?: IBankDetails }): Promise<IWithdrawal>;
    ProcessWithdrawal(withdrawalId: string, action: 'approve' | 'reject', remarks?: string): Promise<void>;
    getPendingWithdrawals(): Promise<IWithdrawal[]>;
    getInspectorWithdrawals(inspectorId: string): Promise<IWithdrawal[]>;
}


