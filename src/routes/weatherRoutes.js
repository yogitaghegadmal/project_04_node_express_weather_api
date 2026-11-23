const express = require("express");
const weatherController = require("../controllers/weatherController");
const validateWeatherQuery = require("../middleware/validateWeatherQuery");

const router = express.Router();

/**
 * Router: /api/weather
 * Current conditions and daily forecast. Validation middleware runs first
 * so controllers only see a clean city (and days, on the forecast route).
 */

/**
 * @openapi
 * /api/weather:
 *   get:
 *     tags:
 *       - Weather
 *     summary: Get current weather for a city
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *           example: London
 *         description: City name, 2 to 80 letters.
 *     responses:
 *       200:
 *         description: Current weather
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CurrentWeatherResponse"
 *       400:
 *         description: Missing or invalid city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       404:
 *         description: City was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       502:
 *         description: Upstream weather service failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/", validateWeatherQuery(), weatherController.getCurrentWeather);

/**
 * @openapi
 * /api/weather/forecast:
 *   get:
 *     tags:
 *       - Weather
 *     summary: Get a daily forecast for a city
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *           example: Mumbai
 *       - in: query
 *         name: days
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 7
 *           default: 3
 *         description: Number of days to return. Defaults to 3.
 *     responses:
 *       200:
 *         description: Daily forecast
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ForecastResponse"
 *       400:
 *         description: Missing or invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       404:
 *         description: City was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       502:
 *         description: Upstream weather service failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/forecast", validateWeatherQuery({ includeDays: true }), weatherController.getForecast);

module.exports = router;
