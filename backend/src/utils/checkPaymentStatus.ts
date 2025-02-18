import cron from 'node-cron';
import paymentService from '../services/payment.service';


cron.schedule('*/5 * * * *', async () => {
    console.log('Cron job triggered at:', new Date().toISOString());
    try {
        await paymentService.handleStaleTransactions();
    } catch (error) {
        console.error('Error in stale transaction cron job:', error);
    }
});