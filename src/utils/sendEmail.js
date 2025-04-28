import nodemailer from "nodemailer";

import { getEnvVar } from "./getEnvVar.js";

const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: getEnvVar('SMTP_PORT'),
    secure: false,
    auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASSWORD')
    },
});
//** send email  **/
export function sendEmail(to, subject, content) {
    return transporter.sendMail({
        from: getEnvVar('SMTP_FROM'),
        to,
        subject,
        html: content,
    });
}
