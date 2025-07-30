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
      .json(new ApiResponse(200, result, "Information Updated Successfully"));
  }
);

export const getPopularDoctors = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    const popularDoctors = await PatientService.popularDoctors();

    return res
      .status(200)
      .json(new ApiResponse(200, popularDoctors, "Data loaded successfully"));
  }
);

export const filterBySpecialty = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { specialty } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }
    const resultDoctors = await PatientService.filterDoctorBySpecialty(
      specialty
    );
    return res
      .status(200)
      .json(new ApiResponse(200, resultDoctors, "Data loaded successfully"));
  }
);

export const searchDoctorsByName = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { searchTerm } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    if (!searchTerm || typeof searchTerm !== 'string') {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Search term is required"));
    }

    const doctors = await PatientService.searchDoctorsByName(searchTerm);

    return res
      .status(200)
      .json(new ApiResponse(200, doctors, "Search results loaded successfully"));
  }
);

export const searchDoctorsByNameAndSpecialty = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { specialty } = req.params;
    const { searchTerm } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    if (!searchTerm || typeof searchTerm !== 'string') {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Search term is required"));
    }

    if (!specialty) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Specialty is required"));
    }

    const doctors = await PatientService.searchDoctorsByNameAndSpecialty(searchTerm, specialty);

    return res
      .status(200)
      .json(new ApiResponse(200, doctors, "Search results loaded successfully"));
  }
);