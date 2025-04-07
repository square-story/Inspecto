import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IWithdrawal, WithDrawal, WithdrawalStatus } from "../models/withdrawal.model";
import { IWithdrawalRepository } from "../core/interfaces/repositories/withdrawal.repository.interface";

@injectable()
export class WithdrawalRepository extends BaseRepository<IWithdrawal> implements IWithdrawalRepository {
    constructor() {
        super(WithDrawal)
    }

    async getPendingWithdrawals(): Promise<IWithdrawal[]> {
        return await this.model
            .find({ status: WithdrawalStatus.PENDING })
            .populate('inspector')
            .sort({ requestDate: 1 })
    }

    async getInspectorWithdrawals(inspectorId: string): Promise<IWithdrawal[]> {
        return await this.model
            .find({ inspector: inspectorId })
            .sort({ requestDate: -1 })
    }
}