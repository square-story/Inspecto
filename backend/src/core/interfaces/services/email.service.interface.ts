export interface IEmailService {
    sendOTP(email: string, otp: string): Promise<boolean>;
    sendInspectionConfirmation(email: string, details: any): Promise<boolean>;
}