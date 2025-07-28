import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { PatientService } from "../../../services/patient.service";

export const patientDetailForm = asyncHandler(async(req: Request, res: Response)=>{
    const result = await PatientService.patientDetailForm(req.body);
    return res.status(200).json(new ApiResponse(200, "Patient Data Saved Successfully"));

});

export const patientInfoUpdate = asyncHandler(async(req: Request, res: Response) => {
    const result = await PatientService.patientInfoUpdate(req.body);
    return res.status(200).json(new ApiResponse(200, result, "Patient Information Updated Successfully"));
}); 