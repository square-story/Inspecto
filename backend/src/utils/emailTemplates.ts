// utils/emailTemplates.ts
export const getApprovalEmailHtml = (firstName: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Account Approved!</h2>
        </div>
        <div class="content">
            <p>Dear ${firstName},</p>
            <p>Congratulations! Your Inspecto account has been approved. You can now start accepting inspection requests through our platform.</p>
            <p><strong>Here's what you can do next:</strong></p>
            <ol>
                <li>Log in to your account</li>
                <li>Complete your profile if you haven't already</li>
                <li>Set your availability</li>
                <li>Start receiving inspection requests</li>
            </ol>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The Inspecto Team</p>
        </div>
    </div>
</body>
</html>
`;

export const getDenialEmailHtml = (firstName: string, reason: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .reason { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #f44336; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Application Update</h2>
        </div>
        <div class="content">
            <p>Dear ${firstName},</p>
            <p>We have reviewed your application to become an inspector on the Inspecto platform. Unfortunately, we are unable to approve your account at this time for the following reason:</p>
            <div class="reason">
                <p>${reason}</p>
            </div>
            <p><strong>If you would like to address these concerns and reapply, please:</strong></p>
            <ol>
                <li>Review the provided reason</li>
                <li>Make necessary adjustments</li>
                <li>Contact our support team for guidance on the reapplication process</li>
            </ol>
            <p>If you believe this decision was made in error or need further clarification, please don't hesitate to reach out to our support team.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The Inspecto Team</p>
        </div>
    </div>
</body>
</html>
`;