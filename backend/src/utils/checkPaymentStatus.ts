import cron from 'node-cron';
import paymentService from '../services/payment.service';

// Run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    try {
        await paymentService.handleStaleTransactions();
    } catch (error) {
        console.error('Error in stale transaction cron job:', error);
    }
});