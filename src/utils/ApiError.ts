import { Error } from "mongoose";

class ApiError extends Error {
    statusCode: number;
    // data?: null;
    // errors: any[];
    message: string;

    constructor(
        statusCode: number = 500,
        // data: null = null,
        // errors: any[] = [],
        message: string = "Error"
    ) {
        super(message);
        this.statusCode = statusCode;
        // this.data = data;
        // this.errors = errors;
        this.message = message;

        // Capture the stack trace, excluding the constructor call
        if (this.stack) {
            this.stack = this.stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };