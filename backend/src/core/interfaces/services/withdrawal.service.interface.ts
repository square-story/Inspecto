import { IBankDetails, IWithdrawal, WithdrawalMethod } from "../../../models/withdrawal.model";

export interface IWithDrawalService {
    requestWithdrawal(inspectorId: string, amount: number, method: WithdrawalMethod, paymentDetails: { upiId?: string, bankDetails?: IBankDetails }): Promise<IWithdrawal>;
    ProcessWithdrawal(withdrawalId: string, action: 'approve' | 'reject', remarks?: string): Promise<void>;
    getPendingWithdrawals(): Promise<IWithdrawal[]>;
    getInspectorWithdrawals(inspectorId: string): Promise<IWithdrawal[]>;
}


