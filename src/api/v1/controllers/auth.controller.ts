import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthService } from "../../../services/auth.service";

export const signUp = asyncHandler(async(req : Request, res: Response) => {
    const result = await AuthService.signUp(req.body);
  
    return res.status(200).json(new ApiResponse(200, "User signed up successfully"));
});

export const login = asyncHandler(async(req: Request, res: Response)=> {
    const data = await AuthService.login(req.body);

    return res.status(200).json(new ApiResponse(200, data, "User logged in successfully"));

});

