import { IWithdrawal } from "../../../models/withdrawal.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IWithdrawalRepository extends BaseRepository<IWithdrawal> {
    getPendingWithdrawals(): Promise<IWithdrawal[]>;
    getInspectorWithdrawals(inspectorId: string): Promise<IWithdrawal[]>;
    getAllWithdrawalsPaginated(page: number, limit: number, status?: string): Promise<{ withdrawals: IWithdrawal[], total: number }>;
}