import { emailConfig } from './global';
import nodemailer from 'nodemailer';

export const sendEmail = async (toEmail, emailSubject, emailContent) => {
    if (emailContent != "") {
        var smtpTransport = nodemailer.createTransport({
            host: emailConfig.SmtpServer,
            port: emailConfig.SmtpPort,
            ignoreTLS: true,
            secure: false,
            secureConnection: false,
            requiresAuth: true,
            auth: {
                user: emailConfig.FromEmail,
                pass: emailConfig.EmailPassword
            }
        });

        var mailOptions = {
            from: "Yam <" + emailConfig.FromEmail + ">",
            to: toEmail,
            replyTo: emailConfig.FromEmail,
            subject: emailSubject,
            html: emailContent
        };
        try {
            let info = await smtpTransport.sendMail(mailOptions);
            console.log('Message sent: ' + info.response);
            return 1;
        } catch (error) {
            if (error) {
                console.log("ERROR: ", error);
                return -1;
            }
        }
    }
    else
        return 0;
}