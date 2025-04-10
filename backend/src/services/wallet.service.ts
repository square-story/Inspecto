import { BaseService } from '../core/abstracts/base.service';
import { IWalletRepository } from '../core/interfaces/repositories/wallet.repository.interface';
import { TYPES } from '../di/types';
import { inject, injectable } from 'inversify';
import { IWalletService } from '../core/interfaces/services/wallet.service.interface';
import { IWallet } from '../models/wallet.model';
import { IAdminWalletStats, IWalletStats } from '../core/types/wallet.stats.type';
import { ServiceError } from '../core/errors/service.error';

@injectable()
export class WalletService extends BaseService<IWallet> implements IWalletService {
  constructor(
    @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository
  ) {
    super(_walletRepository);
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
}
