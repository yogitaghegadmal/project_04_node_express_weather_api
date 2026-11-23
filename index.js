const express = require("express");
const swaggerUi = require("swagger-ui-express");
const createSwaggerSpec = require("./src/config/swagger");
const requestLogger = require("./src/middleware/requestLogger");
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");
const healthRoutes = require("./src/routes/healthRoutes");
const weatherRoutes = require("./src/routes/weatherRoutes");
const HTTP_STATUS = require("./src/constants/httpStatus");

const app = express();
const PORT = process.env.PORT || 8011;

/**
 * Built-in body parsers.
 * This API reads query parameters, but JSON parsing is kept so later
 * POST routes can accept a request body without extra setup.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

const swaggerSpec = createSwaggerSpec(PORT);

/**
 * Interactive API docs. Open http://localhost:8011/api-docs in a browser.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Weather API Docs"
}));

/**
 * Short welcome payload so opening the root URL shows where to go next.
 */
app.get("/", (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        status: "success",
        message: "Weather API",
        endpoints: {
            health: "/health",
            currentWeather: "/api/weather?city=London",
            forecast: "/api/weather/forecast?city=London&days=3",
            docs: "/api-docs"
        }
    });
});

app.use("/health", healthRoutes);
app.use("/api/weather", weatherRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
