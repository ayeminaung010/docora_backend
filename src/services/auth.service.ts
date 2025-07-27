import { signUp } from './../api/v1/controllers/auth.controller';
import { ApiResponse } from "../utils/ApiResponse";

export interface loginRequest{
    email : string;
    password: string;
    rememberMe?: boolean;
}
export interface signUpRequest{
    email: string;
    password: string;
    name: string;
}
export class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || "irene_secret";
    private static readonly JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
    static async signUp(req: signUpRequest) {
        
        return "User signup logic not implemented yet";
    }
}