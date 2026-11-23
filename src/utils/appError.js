/**
 * Error that already knows which HTTP status the client should receive.
 * Controllers pass these to the error-handling middleware with next(error).
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}

module.exports = AppError;
