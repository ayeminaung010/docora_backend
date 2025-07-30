import { Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ConsultationService } from "../../../services/consultation.service";

export const createConsultation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { doctorId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    if (!doctorId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Doctor ID is required"));
    }

    const result = await ConsultationService.createConsulatation(
      userId,
      doctorId,
      req.body
    );
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Consultation created successfully"));
  }
);

export const updateConsultation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await ConsultationService.updateConsultation(id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Consultation updated successfully"));
  }
);
