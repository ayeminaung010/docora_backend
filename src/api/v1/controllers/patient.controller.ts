import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { PatientService } from "../../../services/patient.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const patientDetailForm = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    const result = await PatientService.patientDetailForm(userId, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, "Patient Data Saved Successfully"));
  }
);

export const patientProfileUpdate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    const result = await PatientService.patientProfileUpdate(userId, req.body);
    return res
      .status(200)
      .json(
        new ApiResponse(200, result, "Information Updated Successfully")
      );
  }
);
