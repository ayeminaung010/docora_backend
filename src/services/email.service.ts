// services/email.service.ts
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError";

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  private static initializeTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return this.transporter;
  }

  static async testConnection(): Promise<boolean> {
    try {
      const transporter = this.initializeTransporter();
      await transporter.verify();
      console.log("✅ Email service connection verified successfully");
      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:", error);
      return false;
    }
  }

  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const transporter = this.initializeTransporter();
      
      const mailOptions = {
        from: `"Docora Team" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw new ApiError(500, "Failed to send email");
    }
  }

 
  static async sendPasswordResetOTP(email: string, otp: string, name?: string): Promise<void> {
    const htmlTemplate = this.passwordResetOtpMailTemplate(otp, name);
    const textContent = `
      Password Reset OTP - Docora
      
      Hello ${name || 'User'},
      
      You have requested to reset your password. Please use the following OTP code:
      
      OTP: ${otp}
      
      This OTP will expire in 10 minutes for security reasons.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      Docora Team
    `;

    await this.sendEmail({
      to: email,
      subject: "Password Reset OTP - Docora",
      html: htmlTemplate,
      text: textContent,
    });
  }

 
  static async sendVerificationOTP(email: string, otp: string, name?: string): Promise<void> {
    const htmlTemplate = this.verificationOtpMailTemplate(otp, name);
    const textContent = `
      Email Verification OTP - Docora
      
      Hello ${name || 'User'},
      
      Thank you for signing up with Docora! Please use the following OTP code to verify your email address:
      
      OTP: ${otp}
      
      This OTP will expire in 10 minutes.
      
      If you didn't sign up for Docora, please ignore this email.
      
      Best regards,
      Docora Team
    `;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email - Docora",
      html: htmlTemplate,
      text: textContent,
    });
  }


  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const htmlTemplate = this.welcomeMailTemplate(name);
    const textContent = `
      Welcome to Docora!
      
      Hello ${name},
      
      Welcome to Docora! We're excited to have you on board.
      
      Your account has been successfully created and you can now start exploring our platform.
      
      If you have any questions, feel free to reach out to our support team.
      
      Best regards,
      Docora Team
    `;

    await this.sendEmail({
      to: email,
      subject: "Welcome to Docora! 🎉",
      html: htmlTemplate,
      text: textContent,
    });
  }

  /**
   * Template for Password Reset OTP.
   */
  private static passwordResetOtpMailTemplate(otp: string, name?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Password Reset OTP</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
            }
            .otp-container {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 10px;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 6px;
                margin: 10px 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .otp-label {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 10px;
            }
            .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 25px 0;
                border-radius: 4px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏥 DOCORA</div>
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hello <strong>${name || 'User'}</strong>,</p>
                <p>You have requested to reset your password for your Docora account. Please use the following OTP code to proceed:</p>
                
                <div class="otp-container">
                    <div class="otp-label">Your OTP Code</div>
                    <div class="otp-code">${otp}</div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> This OTP will expire in <strong>10 minutes</strong> for security reasons. Do not share this code with anyone.
                </div>
                
                <p>If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
                
                <p>Stay secure,<br>
                <strong>The Docora Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message from Docora. Please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} Docora. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
  }
  
  /**
   * Template for Email Verification OTP.
   */
  private static verificationOtpMailTemplate(otp: string, name?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #2af598 0%, #009efd 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
            }
            .otp-container {
                background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 10px;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 6px;
                margin: 10px 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .otp-label {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 10px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #0072ff;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏥 DOCORA</div>
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <p>Hello <strong>${name || 'User'}</strong>,</p>
                <p>Thank you for signing up! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
                
                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                </div>
                
                <p>This code is valid for <strong>10 minutes</strong>. If you did not sign up for Docora, you can safely ignore this email.</p>
                
                <p>Best regards,<br>
                <strong>The Docora Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message from Docora. Please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} Docora. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
  }
  
  private static welcomeMailTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to Docora</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-message {
                background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .features {
                margin: 30px 0;
            }
            .feature-item {
                display: flex;
                align-items: center;
                margin: 15px 0;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }
            .feature-icon {
                font-size: 20px;
                margin-right: 15px;
                width: 30px;
                text-align: center;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏥 DOCORA</div>
                <h1>Welcome Aboard!</h1>
            </div>
            <div class="content">
                <div class="welcome-message">
                    <h2>Hello ${name}! 🎉</h2>
                    <p>Welcome to the Docora family! We're thrilled to have you join us.</p>
                </div>
                
                <p>Your account has been successfully created and you're now ready to explore all the amazing features Docora has to offer.</p>
                
                <div class="features">
                    <h3>What's Next?</h3>
                    <div class="feature-item">
                        <span class="feature-icon">📋</span>
                        <span>Complete your profile to get personalized recommendations</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🔍</span>
                        <span>Explore our comprehensive medical resources</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">👥</span>
                        <span>Connect with healthcare professionals</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📱</span>
                        <span>Download our mobile app for on-the-go access</span>
                    </div>
                </div>
                
                <p>If you have any questions or need assistance getting started, our support team is here to help. Just reply to this email or visit our help center.</p>
                
                <p>Once again, welcome to Docora! We're excited to be part of your healthcare journey.</p>
                
                <p>Best regards,<br>
                <strong>The Docora Team</strong></p>
            </div>
            <div class="footer">
                <p>Thank you for choosing Docora!</p>
                <p>© ${new Date().getFullYear()} Docora. All rights reserved.</p>
            </div>
        </div>
    </div>
    </body>
    </html>`;
  }
}
