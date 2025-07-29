import { User } from './../../../models/User.model';
import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse } from "../../../utils/ApiResponse";
import { DoctorService } from "../../../services/doctor.service";
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const verifyIdentityDoctor = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    await DoctorService.verifyIdentity(userId,req.body);

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Doctor's identity verified successfully")
      );
  }
);

export const profileUpdate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    const updatedProfile = await DoctorService.updateProfile(userId, req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
  }
);