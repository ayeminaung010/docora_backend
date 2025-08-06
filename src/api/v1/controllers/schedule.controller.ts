import { Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../../../utils/ApiError";
import { ScheduleService } from "../../../services/schedule.service";
import { ApiResponse } from "../../../utils/ApiResponse";

export const viewScheduleDoctor = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = req.user?.id;
    console.log("Doctor ID:", doctorId);

    if (!doctorId) {
      return res.status(400).json(new ApiError(400, "Doctor ID is required"));
    }

    //go to service and fetch schedule
    const allSchedules = await ScheduleService.getDoctorSchedule(doctorId);

    if (!allSchedules || allSchedules.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "No schedule found for this doctor"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, allSchedules, "Schedule fetched successfully")
      );
  }
);

export const createSchedule = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = req.user?.id;
    const scheduleData = req.body;

    if (!doctorId || !scheduleData) {
      return res.status(400).json(new ApiError(400, "Invalid request data"));
    }

    //go to service and create schedule
    const newSchedule = await ScheduleService.createSchedule(doctorId, scheduleData);

    if (!newSchedule) {
      return res.status(500).json(new ApiError(500, "Failed to create schedule"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newSchedule, "Schedule created successfully"));
  }
);
