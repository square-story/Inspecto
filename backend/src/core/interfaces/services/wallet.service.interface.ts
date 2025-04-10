import { IWallet } from "../../../models/wallet.model";
import { IWalletStats } from "../../types/wallet.stats.type";
import { IBaseService } from "./base/base.service.interface";

export interface IWalletService extends IBaseService<IWallet> {
    // Stats about the inspactor wallet
    getWalletStatsAboutInspector(inspectorId: string): Promise<IWalletStats>;
}
