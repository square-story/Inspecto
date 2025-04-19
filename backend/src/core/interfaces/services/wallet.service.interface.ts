import { IWallet } from "../../../models/wallet.model";
import { IAdminWalletStats, IUserWalletStats, IWalletStats } from "../../types/wallet.stats.type";
import { IBaseService } from "./base/base.service.interface";

export interface IWalletService extends IBaseService<IWallet> {
    getWalletStatsAboutInspector(inspectorId: string): Promise<IWalletStats>;
    getWalletStatsAboutAdmin(): Promise<IAdminWalletStats>;
    getWalletStatsAboutUser(userId: string): Promise<IUserWalletStats>;
    processRefundToUserWallet(userId: string, amount: number, reference: string, description: string): Promise<IWallet>;
}
