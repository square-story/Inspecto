export interface IEmailService {
    sendApprovalEmail(inspectorEmail: string, firstName: string): Promise<void>;
    sendDenialEmail(inspectorEmail: string, firstName: string, reason: string): Promise<void>;
}