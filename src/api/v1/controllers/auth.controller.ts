import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthService } from "../../../services/auth.service";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.signUp(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "User signed up successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.login(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "User logged in successfully"));
});

export const verifyToken = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json(new ApiResponse(200, req.user, "Token is Vaild"));
  }
);

export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    
    if (!userId) {
        return res.status(401).json(
            new ApiResponse(401, null, "Unauthorized - User ID not found")
        );
    }

    try {
        const result = await AuthService.refreshToken(userId);

        return res.status(200).json(
            new ApiResponse(200, {
                token: result.token,
                user: result.user,
                refreshed: true
            }, "Token refreshed successfully")
        );
    } catch (error: any) {
        return res.status(401).json(
            new ApiResponse(401, null, error.message)
        );
    }
});

// New endpoint for checking token status
export const checkTokenStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);
    
    if (!token) {
        return res.status(401).json(
            new ApiResponse(401, null, "No token provided")
        );
    }

    try {
        const isExpiringSoon = AuthService.isTokenExpiringSoon(token);
        const decoded = AuthService.verifyToken(token);
        
        return res.status(200).json(
            new ApiResponse(200, {
                valid: true,
                expiringSoon: isExpiringSoon,
                expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null
            }, "Token status checked")
        );
    } catch (error: any) {
        return res.status(401).json(
            new ApiResponse(401, { valid: false }, error.message)
        );
    }
});

export const changePassword = asyncHandler(
    async( req: AuthenticatedRequest, res: Response) => {
        const userId =  req.user?.userId;
        if(!userId) {
            return res.status(401).json(
                new ApiResponse(401, null, "Unauthorized - User ID not found")
            );
        }

        const result = await AuthService.changePassword(userId, req.body);
        return res.status(200).json(
            new ApiResponse(200, result, "Password changed successfully")
        );
    }
);

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

