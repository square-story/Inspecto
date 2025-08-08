import { IWalletRepository } from '../core/interfaces/repositories/wallet.repository.interface';
import { TYPES } from '../di/types';
import { inject, injectable } from 'inversify';
import { IWalletService } from '../core/interfaces/services/wallet.service.interface';
import { IWallet } from '../models/wallet.model';
import { IAdminWalletStats, IUserWalletStats, IWalletStats } from '../core/types/wallet.stats.type';
import { ServiceError } from '../core/errors/service.error';

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository
  ) {
  }

  async getWalletStatsAboutInspector(inspectorId: string): Promise<IWalletStats> {
    try {
      return await this._walletRepository.WalletStatsInspector(inspectorId)
    } catch (error) {
      console.error(`Error get Stats About Wallet Transaction ${inspectorId}:`, error);
      throw new ServiceError('Error get Stats About Wallet');
    }
  }

  async getWalletStatsAboutAdmin(): Promise<IAdminWalletStats> {
    try {
      return await this._walletRepository.WalletStatsAdmin()
    } catch (error) {
      console.log('Error get Stats About Admin Wallet Transaction', error)
      throw new ServiceError('Error Get Stats about Admin wallet')
    }
  }
  async getWalletStatsAboutUser(userId: string): Promise<IUserWalletStats> {
    try {
      return await this._walletRepository.WalletStatsUser(userId)
    } catch (error) {
      console.error(`Error getting stats about user wallet transaction ${userId}:`, error);
      throw new ServiceError('Error getting stats about user wallet');
    }
  }

  async processRefundToUserWallet(userId: string, amount: number, reference: string, description: string): Promise<IWallet> {
    try {
      return await this._walletRepository.processRefundToUserWallet(userId, amount, reference, description);
    } catch (error) {
      console.error(`Error processing refund to user wallet ${userId}:`, error);
      throw new ServiceError('Error processing refund to user wallet'); // TODO: add custom error message here
    }
  }
}
