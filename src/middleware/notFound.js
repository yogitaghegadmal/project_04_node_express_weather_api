const HTTP_STATUS = require("../constants/httpStatus");

/**
 * Middleware: answer any path that no router handled.
 * This must be registered after all real routes.
 */
function notFound(req, res) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: `Route ${req.method} ${req.originalUrl} was not found.`
    });
}

module.exports = notFound;
