import { Request, Response } from "express";
import { UserService } from "../../../services/user.service";
import { ApiResponse } from "../../../utils/ApiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";


export const getPatients = asyncHandler(async(req : Request, res: Response) => {
    const patientsAll = await UserService.getAllPatients();
    return res.status(200).json(new ApiResponse(200, patientsAll, "Patients fetched successfully"));
});

export const verifyToken = asyncHandler(async(req : Request, res: Response) => {
    
    return res.status(200).json(new ApiResponse(200, "Token verified"));
});