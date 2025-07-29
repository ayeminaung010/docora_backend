import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-email@example.com",
    pass: "your-email-password",
  },
});

const mailOptions = (
  from: string,
  sendTo: string,
  subject: string,
  text: string,
  htmlTemplate: string
) => ({
  from: from,
  to: sendTo,
  subject: subject,
  text: text,
  html: htmlTemplate,
});

export const otpMailTemplate = (otp: string) =>
  `<html>
    <body>
        <h1>OTP Verification</h1>
        <p>Use the following OTP to verify your account: ${otp}</p>
    </body>
    </html>`;

export { transporter, mailOptions };
