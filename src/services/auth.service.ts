import { User } from "../models/User.model";
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
export class AuthService {
  private static readonly JWT_SECRET = (process.env.JWT_SECRET || "irene_secret") as string;
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

 
  static generateToken(userId: string): string {
    return jwt.sign(
      { userId }, 
      this.JWT_SECRET, 
      { expiresIn: this.JWT_EXPIRES_IN } as SignOptions
    );
  }

  static verifyToken(token: string): any{
    try{
      return jwt.verify(token, this.JWT_SECRET);
    }catch(error){
      throw new ApiError(401,"Invalid or expired token");
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
    console.log(req);

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
}
