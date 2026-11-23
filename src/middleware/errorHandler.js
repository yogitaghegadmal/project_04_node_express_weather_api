const HTTP_STATUS = require("../constants/httpStatus");

/**
 * Middleware: catch errors forwarded with next(error).
 * Express recognizes this as an error handler because it has 4 parameters.
 * Known AppError values keep their status code. Everything else becomes 500
 * so internal details are not sent to the client.
 */
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const isServerError = statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR;

    console.error(err);

    res.status(statusCode).json({
        status: "error",
        message: isServerError
            ? "Something went wrong. Please try again later."
            : err.message
    });
}

module.exports = errorHandler;
