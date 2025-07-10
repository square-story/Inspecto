import { IWallet } from "../../../models/wallet.model";
import { IAdminWalletStats, IUserWalletStats, IWalletStats } from "../../types/wallet.stats.type";

export interface IWalletService {
    getWalletStatsAboutInspector(inspectorId: string): Promise<IWalletStats>;
    getWalletStatsAboutAdmin(): Promise<IAdminWalletStats>;
    getWalletStatsAboutUser(userId: string): Promise<IUserWalletStats>;
    processRefundToUserWallet(userId: string, amount: number, reference: string, description: string): Promise<IWallet>;
}
