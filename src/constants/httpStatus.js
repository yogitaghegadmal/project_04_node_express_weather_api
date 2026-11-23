/**
 * HTTP status codes used by this API.
 * Keeping them in one place makes responses consistent across routes.
 */
const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502
};

module.exports = HTTP_STATUS;
