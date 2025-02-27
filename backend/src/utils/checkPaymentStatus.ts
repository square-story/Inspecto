import cron from 'node-cron';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IPaymentService } from '../core/interfaces/services/payment.service.interface';

@injectable()
export class PaymentStatusChecker {
    constructor(
        @inject(TYPES.PaymentService) private paymentService: IPaymentService
    ) {
        this.initCronJob();
    }

    private initCronJob() {
        cron.schedule('*/5 * * * *', async () => {
            console.log('Cron job triggered at:', new Date().toISOString());
            try {
                await this.paymentService.handleStaleTransactions();
            } catch (error) {
                console.error('Error in stale transaction cron job:', error);
            }
        });
    }
}