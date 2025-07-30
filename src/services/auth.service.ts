import { User, IUser } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import jwt, { SignOptions } from "jsonwebtoken";

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
  password: string;
}

export class AuthService {
  private static readonly JWT_SECRET = (process.env.JWT_SECRET ||
    "irene_secret") as string;
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
  private static readonly REFRESH_THRESHOLD = 24 * 60 * 60;

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
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
    const existingUser = await User.findOne({ email: req.email });
    if (existingUser) {
      throw new ApiError(403, "User already exists with this email");
    }

    const newUser = new User({
      name: req.name,
      email: req.email,
      password: req.password,
    });

    const savedUser = await newUser.save();

    return savedUser;
  }

  static async login(req: loginRequest) {
    const user = await User.findOne({ email: req.email });
    console.log(user);
    if (!user) {
      throw new ApiError(404, "Invalid email or password");
    }

    const isPasswordCorrect = await user.isCorrectPassword(req.password);
    if (!isPasswordCorrect) {
      throw new ApiError(404, "Invalid email or password");
    }

    const token = this.generateToken(user._id.toString());
    console.log("Token", token);

    const userId = user._id.toString();

    return {
      userId,
      token,
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

  // Enhanced method to check if refresh is needed
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

  static async getUserById(userId: string): Promise<any> {
    const user = await User.findById({ _id: userId });
    return user;
  }

  static async changePassword(
    userId: string,
    req: PasswordChangeRequest
  ): Promise<IUser> {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = req.password;
    await user.save();
    return user;
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    ////OTP send
    // For now, we will just simulate the process
    console.log(`Password reset link sent to ${email}`);
  }
}
