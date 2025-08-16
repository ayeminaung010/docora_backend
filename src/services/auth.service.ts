import { User, IUser } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { EmailService } from "./email.service";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export interface loginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface signUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export class AuthService {
  private static readonly JWT_SECRET = (process.env.JWT_SECRET ||
    "irene_secret") as string;
  private static readonly JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h") as string;
  private static readonly REFRESH_THRESHOLD = 24 * 60 * 60;
  
  // Store OTPs temporarily (in production, use Redis or database)
  private static otpStore: Map<string, { otp: string; expires: Date; attempts: number }> = new Map();
  private static readonly MAX_OTP_ATTEMPTS = 3;
  private static readonly OTP_EXPIRY_MINUTES = 10;

  // Initialize OTP cleanup interval
  static {
    // Clean up expired OTPs every 5 minutes
    setInterval(() => {
      AuthService.cleanupExpiredOTPs();
    }, 5 * 60 * 1000);
  }

  static generateToken(userId: string, rememberMe: boolean = false): string {
    const expiresIn = rememberMe ? "30d" : this.JWT_EXPIRES_IN;
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn,
    } as SignOptions);
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }
  }

  static async signUp(req: signUpRequest) {
    // Validate input
    if (!req.email || !req.password || !req.name) {
      throw new ApiError(400, "Email, password, and name are required");
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.email)) {
      throw new ApiError(400, "Invalid email format");
    }

    // Check password strength
    if (req.password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const existingUser = await User.findOne({ email: req.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    const newUser = new User({
      name: req.name.trim(),
      email: req.email.toLowerCase(),
      password: req.password,
    });

    const savedUser = await newUser.save();

    try {
      await EmailService.sendWelcomeEmail(savedUser.email, savedUser.name);
    } catch (emailError) {
      console.error('⚠️ Failed to send welcome email:', emailError);
      // Don't throw error here as user registration was successful
    }

    // Remove password from response
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    };

    return userResponse;
  }

  static async login(req: loginRequest) {
    if (!req.email || !req.password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: req.email.toLowerCase() });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.isCorrectPassword(req.password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = this.generateToken(user._id.toString(), req.rememberMe || false);
    console.log("Token generated for user:", user.email);

    return {
      userId: user._id.toString(),
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }

  static isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;

      return timeUntilExpiry < this.REFRESH_THRESHOLD;
    } catch (error) {
      return true;
    }
  }

  static async refreshToken(
    userId: string
  ): Promise<{ token: string; user: IUser }> {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const newToken = this.generateToken(userId);
    return { token: newToken, user };
  }

  static async refreshTokenIfNeeded(
    currentToken: string
  ): Promise<{ token: string; refreshed: boolean }> {
    try {
      const decoded = this.verifyToken(currentToken);

      if (this.isTokenExpiringSoon(currentToken)) {
        const refreshResult = await this.refreshToken(decoded.userId);
        return { token: refreshResult.token, refreshed: true };
      }

      return { token: currentToken, refreshed: false };
    } catch (error) {
      throw new ApiError(401, "Token refresh required");
    }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select("-password");
      return user;
    } catch (error) {
      throw new ApiError(400, "Invalid user ID");
    }
  }

  static async changePassword(
    userId: string,
    req: PasswordChangeRequest
  ): Promise<Partial<IUser>> {
    if (!req.oldPassword) {
      throw new ApiError(400, "Password is required");
    }

    if (req.oldPassword.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

     const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.isCorrectPassword(req.oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    user.password = req.newPassword;
    await user.save();
    
    // Return user without password
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, "User not found with this email address");
    }

    // Check if there's already an active OTP
    const existingOtp = this.otpStore.get(email.toLowerCase());
    if (existingOtp && new Date() < existingOtp.expires) {
      const timeLeft = Math.ceil((existingOtp.expires.getTime() - Date.now()) / 1000 / 60);
      throw new ApiError(429, `OTP already sent. Please wait ${timeLeft} minutes before requesting a new one.`);
    }

    // Generate new OTP
    const otp = this.generateOTP();
    const expirationTime = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP
    this.otpStore.set(email.toLowerCase(), {
      otp,
      expires: expirationTime,
      attempts: 0
    });

    try {
      // Send OTP email
      await EmailService.sendPasswordResetOTP(email, otp, user.name);
      console.log(`✅ Password reset OTP sent to ${email}`);
      
      return { 
        message: `Password reset OTP has been sent to ${email}. The OTP will expire in ${this.OTP_EXPIRY_MINUTES} minutes.` 
      };
    } catch (emailError) {
      // Remove OTP from store if email failed
      this.otpStore.delete(email.toLowerCase());
      console.error('❌ Failed to send OTP email:', emailError);
      throw new ApiError(500, "Failed to send password reset email. Please try again later.");
    }
  }

  static async sendSignUpOTP(email: string, name: string): Promise<{ message: string }> {
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, "User not found with this email address");
    }

    // Check if there's already an active OTP
    // const existingOtp = this.otpStore.get(email.toLowerCase());
    // if (existingOtp && new Date() < existingOtp.expires) {
    //   const timeLeft = Math.ceil((existingOtp.expires.getTime() - Date.now()) / 1000 / 60);
    //   throw new ApiError(429, `OTP already sent. Please wait ${timeLeft} minutes before requesting a new one.`);
    // }

    // Generate new OTP
    const otp = this.generateOTP();
    const expirationTime = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP
    this.otpStore.set(email.toLowerCase(), {
      otp,
      expires: expirationTime,
      attempts: 0
    });

    try {
      await EmailService.sendVerificationOTP(email, otp, name);
      console.log(`✅ Sign-up OTP sent to ${email}`);

      return {
        message: `Sign-up OTP has been sent to ${email}. The OTP will expire in ${this.OTP_EXPIRY_MINUTES} minutes.`
      };
    } catch (emailError) {
      this.otpStore.delete(email.toLowerCase());
      console.error('❌ Failed to send sign-up OTP email:', emailError);
      throw new ApiError(500, "Failed to send sign-up OTP email. Please try again later.");
    }
  }


  static async verifyOTP(email: string, otp: string): Promise<{ message: string; isValid: boolean }> {
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const storedOtpData = this.otpStore.get(email.toLowerCase());
    
    if (!storedOtpData) {
      throw new ApiError(400, "No OTP found for this email. Please request a new one.");
    }

    // Check if OTP has expired
    if (new Date() > storedOtpData.expires) {
      this.otpStore.delete(email.toLowerCase());
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    // Increment attempts
    storedOtpData.attempts++;

    // Check if max attempts exceeded
    if (storedOtpData.attempts > this.MAX_OTP_ATTEMPTS) {
      this.otpStore.delete(email.toLowerCase());
      throw new ApiError(400, "Too many invalid attempts. Please request a new OTP.");
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      const attemptsLeft = this.MAX_OTP_ATTEMPTS - storedOtpData.attempts;
      throw new ApiError(400, `Invalid OTP. ${attemptsLeft} attempts remaining.`);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { verifyEmail: true } }, 
      { new: true } 
    );

    return { message: "OTP verified successfully", isValid: true };
  }

  

  static async resetPassword(req: PasswordResetRequest): Promise<{ message: string }> {
    const { email, otp, newPassword } = req;

    if (!email || !otp || !newPassword) {
      throw new ApiError(400, "Email, OTP, and new password are required");
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Verify OTP first
    await this.verifyOTP(email, otp);

    // Find user and update password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Remove OTP from store after successful reset
    this.otpStore.delete(email.toLowerCase());

    console.log(`✅ Password successfully reset for ${email}`);
    return { message: "Password has been reset successfully. You can now login with your new password." };
  }

  // Cleanup expired OTPs (call this periodically)
  static cleanupExpiredOTPs(): void {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [email, data] of this.otpStore.entries()) {
      if (now > data.expires) {
        this.otpStore.delete(email);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired OTPs`);
    }
  }

  // Get OTP store stats (for debugging)
  static getOTPStats(): { activeOTPs: number; details: Array<{ email: string; expiresIn: number; attempts: number }> } {
    const now = new Date();
    const details = Array.from(this.otpStore.entries()).map(([email, data]) => ({
      email,
      expiresIn: Math.max(0, Math.ceil((data.expires.getTime() - now.getTime()) / 1000 / 60)),
      attempts: data.attempts
    }));

    return {
      activeOTPs: this.otpStore.size,
      details
    };
  }

  // Test email service connection
  static async testEmailConnection(): Promise<boolean> {
    return await EmailService.testConnection();
  }
}