import { Error } from "mongoose";

class ApiError extends Error {
    statusCode: number;
    data: null;
    success: boolean;
    errors: any[];

    constructor(
        message: string,
        statusCode: number = 500,
        data: null = null,
        errors: any[] = []
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.success = false;
        this.errors = errors;

       
    }
}

export { ApiError };