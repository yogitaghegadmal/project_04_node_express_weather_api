const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

/**
 * Build the OpenAPI document from the JSDoc blocks on the route files.
 * Swagger UI is mounted at /api-docs in index.js.
 */
function createSwaggerSpec(port) {
    return swaggerJsdoc({
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Weather API",
                version: "1.0.0",
                description: "Beginner REST API that looks up current weather and a short forecast by city name."
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: "Local server"
                }
            ],
            tags: [
                {
                    name: "Weather",
                    description: "Current conditions and daily forecast"
                },
                {
                    name: "Health",
                    description: "Process health check"
                }
            ],
            components: {
                schemas: {
                    CurrentWeatherResponse: {
                        type: "object",
                        properties: {
                            status: { type: "string", example: "success" },
                            data: {
                                type: "object",
                                properties: {
                                    city: { type: "string", example: "London" },
                                    country: { type: "string", example: "United Kingdom" },
                                    current: {
                                        type: "object",
                                        properties: {
                                            temperature: { type: "number", example: 12.4 },
                                            temperatureUnit: { type: "string", example: "°C" },
                                            humidity: { type: "number", example: 78 },
                                            condition: { type: "string", example: "Partly cloudy" }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    ForecastResponse: {
                        type: "object",
                        properties: {
                            status: { type: "string", example: "success" },
                            data: {
                                type: "object",
                                properties: {
                                    city: { type: "string", example: "Mumbai" },
                                    days: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                date: { type: "string", example: "2026-11-23" },
                                                temperatureMax: { type: "number", example: 32.1 },
                                                temperatureMin: { type: "number", example: 24.4 },
                                                condition: { type: "string", example: "Slight rain" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    ErrorResponse: {
                        type: "object",
                        properties: {
                            status: { type: "string", example: "error" },
                            message: { type: "string", example: "No city found for \"Atlantis\"." }
                        }
                    },
                    ValidationError: {
                        type: "object",
                        properties: {
                            status: { type: "string", example: "error" },
                            message: { type: "string", example: "Validation failed" },
                            errors: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        field: { type: "string", example: "city" },
                                        message: { type: "string", example: "Query parameter \"city\" is required." }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        apis: [
            path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")
        ]
    });
}

module.exports = createSwaggerSpec;
