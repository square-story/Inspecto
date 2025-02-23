// services/email.service.ts
import { injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { IEmailService } from '../core/interfaces/services/email.service.interface';
import { sendEmail } from '../utils/email';

@injectable()
export class EmailService implements IEmailService {
    sendOTP(email: string, otp: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    sendInspectionConfirmation(email: string, details: any): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async sendApprovalEmail(inspectorEmail: string, firstName: string) {
        const subject = 'Your Inspector Account Has Been Approved';
        const text = `
Dear ${firstName},

Congratulations! Your Inspecto account has been approved. You can now start accepting inspection requests through our platform.

Here's what you can do next:
1. Log in to your account
2. Complete your profile if you haven't already
3. Set your availability
4. Start receiving inspection requests

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The Inspecto Team
        `;

        try {
            await sendEmail(inspectorEmail, subject, text);
        } catch (error) {
            console.error('Error sending approval email:', error);
            // Don't throw error to prevent blocking the approval process
        }
    }

    async sendDenialEmail(inspectorEmail: string, firstName: string, reason: string) {
        const subject = 'Update Regarding Your Inspector Account Application';
        const text = `
Dear ${firstName},

We have reviewed your application to become an inspector on the Inspecto platform. Unfortunately, we are unable to approve your account at this time for the following reason:

${reason}

If you would like to address these concerns and reapply, please:
1. Review the provided reason
2. Make necessary adjustments
3. Contact our support team for guidance on the reapplication process

If you believe this decision was made in error or need further clarification, please don't hesitate to reach out to our support team.

Best regards,
The Inspecto Team
        `;

        try {
            await sendEmail(inspectorEmail, subject, text);
        } catch (error) {
            console.error('Error sending denial email:', error);
            // Don't throw error to prevent blocking the denial process
        }
    }
}