class ApiResponse<T>  {
    statusCode: number;
    data: T;
    success: boolean;
    message: string;

    constructor(statusCode: number, data: T, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.success = true;
        this.message = message;
    }
}

export { ApiResponse };