const HTTP_STATUS = require("../constants/httpStatus");
const weatherService = require("../services/weatherService");

/**
 * Controller: GET /api/weather
 * Reads the city already checked by validateWeatherQuery and returns
 * the current conditions with HTTP 200.
 */
async function getCurrentWeather(req, res, next) {
    try {
        const weather = await weatherService.getCurrentWeather(req.validated.city);

        res.status(HTTP_STATUS.OK).json({
            status: "success",
            data: weather
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Controller: GET /api/weather/forecast
 * Returns the daily forecast for the validated city and day count.
 */
async function getForecast(req, res, next) {
    try {
        const forecast = await weatherService.getForecast(
            req.validated.city,
            req.validated.days
        );

        res.status(HTTP_STATUS.OK).json({
            status: "success",
            data: forecast
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCurrentWeather,
    getForecast
};
