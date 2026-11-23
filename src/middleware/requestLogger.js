/**
 * Middleware: log every incoming request.
 * Runs before the routers so you can see the method and path in the terminal.
 */
function requestLogger(req, res, next) {
    const startedAt = Date.now();

    res.on("finish", () => {
        const elapsedMs = Date.now() - startedAt;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs}ms`);
    });

    next();
}

module.exports = requestLogger;
