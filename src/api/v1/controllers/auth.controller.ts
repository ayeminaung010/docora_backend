import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";

export const signUp = asyncHandler(async(req : Request, res: Response) => {
    console.log(req.body);
    // const existingUser = await 
    const data : any = {};
    return res.status(200).json(new ApiResponse(200, data, "User signed up successfully"));
});