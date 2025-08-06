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

    const result = await ConsultationService.createConsultation(
      userId,
      doctorId,
      req.body
    );
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Consultation created successfully"));
  }
);

export const endConsultation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await ConsultationService.endConsultation(id);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Consultation ended successfully"));
  }
);

export const addNoteToConsultation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await ConsultationService.addNoteToConsultation(
      id,
      req.body
    );
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Consultation updated successfully"));
  }
);

export const viewConsultation = asyncHandler(async (req: AuthenticatedRequest, res: Response)=> {
    const userId = req.user?.userId;
    const {id}= req.params;

     if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }
    const result = await ConsultationService.viewConsultation(userId,id);

     return res
      .status(200)
      .json(new ApiResponse(200, result, "Consultation data get"));

});
export const getUpcomingConsultations = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is required"));
  }

  const result = await ConsultationService.getUpcomingConsultations(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Upcoming consultations retrieved successfully"));
})

export const getPastConsultations = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is required"));
  }

  const result = await ConsultationService.getPastConsultations(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Past consultations retrieved successfully"));
});


export const getUpcomingConsultationsForDoctor = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = req.user?.userId;

    if (!doctorId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Doctor ID is required"));
    }

    const result = await ConsultationService.getUpcomingConsultationsForDoctor(doctorId);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Upcoming consultations for doctor retrieved successfully"));
  }
);

export const getPastConsultationsForDoctor = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = req.user?.userId;

    if (!doctorId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Doctor ID is required"));
    }

    const result = await ConsultationService.getPastConsultationsForDoctor(doctorId);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Past consultations for doctor retrieved successfully"));
  }
);
