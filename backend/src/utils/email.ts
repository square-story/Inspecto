import nodemailer from "nodemailer"
import appConfig from "../config/app.config"

const transporter = nodemailer.createTransport({
    host: appConfig.smtpHost,
    port: appConfig.smtpPort,
    secure: appConfig.smtpPort === 465,
    auth: {
        user: appConfig.smtpUser,
        pass: appConfig.smtpPass
    },
    pool: true, // Use pooled connections for better performance
    connectionTimeout: 30000, // 30 seconds
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const mailOptions = {
            from: `"Inspecto" <${appConfig.smtpUser}>`,
            to,
            subject,
            text,
            html: html || text
        }
        return transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}