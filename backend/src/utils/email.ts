import * as brevo from '@getbrevo/brevo';
import appConfig from "../config/app.config";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, appConfig.brevoApiKey);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.textContent = text;
        sendSmtpEmail.htmlContent = html || text;
        sendSmtpEmail.sender = { name: "Inspecto", email: appConfig.smtpUser };
        sendSmtpEmail.to = [{ email: to }];

        const { body } = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Brevo Email Result:', body);
        return body;
    } catch (error) {
        console.error('Brevo Email Error:', error);
        throw new Error('Failed to send email');
    }
}