import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware"; // Assuming you have this interface
import { ApiError } from "../../../utils/ApiError";

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Get the user's role from the request object
    const userRole = req.user?.role;

    // 2. Check if the user has a role assigned
    if (!userRole) {
      // 403 Forbidden: The user is likely authenticated but lacks a role
      return res.status(403).json(new ApiError(403, "Permission Denied: unauthorized access."));
    }

    // 3. Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(userRole)) {
      // 403 Forbidden: The user's role is not permitted to access this resource
      return res.status(403).json(new ApiError(403, "You do not have permission to perform this action."));
    }

    // If all checks pass, proceed to the next middleware or controller
    next();
  };
};