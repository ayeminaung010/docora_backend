import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthService } from "../../../services/auth.service";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.signUp(req.body);

  try {
    await AuthService.sendSignUpOTP(result.email, result.name);
    // console.log(`✅ Sign-up OTP sent to ${result.email} after registration`);
  } catch (otpError) {
    console.error('⚠️ Failed to send sign-up OTP:', otpError);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, result, "User signed up successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.login(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "User logged in successfully"));
});

export const verifyToken = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json(new ApiResponse(200, req.user, "Token is valid"));
  }
);

export const refreshToken = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized - User ID not found"));
    }

    try {
      const result = await AuthService.refreshToken(userId);

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            token: result.token,
            user: result.user,
            refreshed: true,
          },
          "Token refreshed successfully"
        )
      );
    } catch (error: any) {
      return res.status(401).json(new ApiResponse(401, null, error.message));
    }
  }
);

export const checkTokenStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "No token provided"));
    }

    try {
      const isExpiringSoon = AuthService.isTokenExpiringSoon(token);
      const decoded = AuthService.verifyToken(token);

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            valid: true,
            expiringSoon: isExpiringSoon,
            expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
          },
          "Token status checked"
        )
      );
    } catch (error: any) {
      return res
        .status(401)
        .json(new ApiResponse(401, { valid: false }, error.message));
    }
  }
);

export const sendSignUpOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, name } = req.body;

    if (!email || !name) {
      throw new ApiError(400, "Email and name are required");
    }

    const result = await AuthService.sendSignUpOTP(email, name);

    return res
      .status(200)
      .json(new ApiResponse(200, null, result.message));
  }
);

export const changePassword = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized - User ID not found"));
    }

    const result = await AuthService.changePassword(userId, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Password changed successfully"));
  }
);

export const logout = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const result = await AuthService.forgotPassword(email);

    return res
      .status(200)
      .json(new ApiResponse(200, null, result.message));
  }
);

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  const result = await AuthService.verifyOTP(email, otp);
  
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    
    if (!otp) {
      throw new ApiError(400, "OTP is required");
    }
    
    if (!newPassword) {
      throw new ApiError(400, "New password is required");
    }

    const result = await AuthService.resetPassword({
      email,
      otp,
      newPassword
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, result.message));
  }
);

// Optional: Add endpoint to get OTP statistics (for debugging/monitoring)
export const getOTPStats = asyncHandler(
  async (req: Request, res: Response) => {
    // Only allow in development or for admin users
    if (process.env.NODE_ENV === 'production') {
      throw new ApiError(403, "Not available in production");
    }
    
    const stats = AuthService.getOTPStats();
    return res
      .status(200)
      .json(new ApiResponse(200, stats, "OTP statistics retrieved"));
    }
);

export const getMeAuth = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized - User ID not found"));
    }

    const user = await AuthService.getUserById(userId);
    return res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
  }
);