import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../../services/auth.service";
import { ApiResponse } from "../../../utils/ApiResponse";

// Main authentication middleware

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify the token
    const decoded = AuthService.verifyToken(token);
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};


export const authenticateTokenWithAutoRefresh = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;
        
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
  
        if (!token) {
            return res.status(401).json(
                new ApiResponse(401, null, "Access token is required")
            );
        }

        try {
            // Try to refresh token if needed
            const refreshResult = await AuthService.refreshTokenIfNeeded(token);
            
            if (refreshResult.refreshed) {
                              
                // Add header to indicate token was refreshed
                res.setHeader('X-Token-Refreshed', 'true');
                res.setHeader('X-New-Token', refreshResult.token);

                console.log("New Token: ", refreshResult.token);
            }
            
            const decoded = AuthService.verifyToken(refreshResult.token);
            const user = await AuthService.getUserById(decoded.userId);
            
            if (!user) {
                return res.status(401).json(
                    new ApiResponse(401, null, "Invalid token - user not found")
                );
            }

            req.user = { userId: decoded.userId, ...user.toObject() };
            next();
            
        } catch (error: any) {
            return res.status(401).json(
                new ApiResponse(401, null, error.message)
            );
        }
    } catch (error: any) {
        return res.status(500).json(
            new ApiResponse(500, null, "Authentication error")
        );
    }
};