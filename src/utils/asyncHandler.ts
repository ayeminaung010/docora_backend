import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "./ApiError";

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
          statusCode: err.statusCode,
          success: false,
          message: err.message,
          
        });
      }
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: err.message || "Internal server error",
        
      });
    });
  };
};

export { asyncHandler };
