const HTTP_STATUS = require("../constants/httpStatus");

const CITY_PATTERN = /^[a-zA-Z][a-zA-Z\s.'-]*$/;
const MIN_CITY_LENGTH = 2;
const MAX_CITY_LENGTH = 80;
const MIN_FORECAST_DAYS = 1;
const MAX_FORECAST_DAYS = 7;
const DEFAULT_FORECAST_DAYS = 3;

/**
 * Check the city query value and push a field error when it is invalid.
 */
function collectCityErrors(city, errors) {
    if (city === undefined || city === null || String(city).trim() === "") {
        errors.push({
            field: "city",
            message: "Query parameter \"city\" is required. Example: ?city=London"
        });
        return null;
    }

    const trimmedCity = String(city).trim();

    if (trimmedCity.length < MIN_CITY_LENGTH || trimmedCity.length > MAX_CITY_LENGTH) {
        errors.push({
            field: "city",
            message: `City must be between ${MIN_CITY_LENGTH} and ${MAX_CITY_LENGTH} characters.`
        });
    } else if (!CITY_PATTERN.test(trimmedCity)) {
        errors.push({
            field: "city",
            message: "City can only contain letters, spaces, dots, apostrophes, and hyphens."
        });
    }

    return trimmedCity;
}

/**
 * Check the optional days query value used by the forecast route.
 * A missing value is allowed and becomes the default of 3 days.
 */
function collectDaysErrors(days, errors) {
    if (days === undefined || days === null || String(days).trim() === "") {
        return DEFAULT_FORECAST_DAYS;
    }

    const daysText = String(days).trim();

    if (!/^\d+$/.test(daysText)) {
        errors.push({
            field: "days",
            message: `Days must be a whole number from ${MIN_FORECAST_DAYS} to ${MAX_FORECAST_DAYS}.`
        });
        return null;
    }

    const parsedDays = Number(daysText);

    if (parsedDays < MIN_FORECAST_DAYS || parsedDays > MAX_FORECAST_DAYS) {
        errors.push({
            field: "days",
            message: `Days must be between ${MIN_FORECAST_DAYS} and ${MAX_FORECAST_DAYS}.`
        });
    }

    return parsedDays;
}

/**
 * Middleware factory: validate weather query parameters before the controller runs.
 * Pass { includeDays: true } on the forecast route so "days" is checked too.
 * Invalid input stops here with HTTP 400 and never calls the weather service.
 */
function validateWeatherQuery(options = {}) {
    const includeDays = Boolean(options.includeDays);

    return function validateWeatherQueryMiddleware(req, res, next) {
        const errors = [];
        const city = collectCityErrors(req.query.city, errors);
        const days = includeDays ? collectDaysErrors(req.query.days, errors) : undefined;

        if (errors.length > 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "error",
                message: "Validation failed",
                errors
            });
        }

        req.validated = { city };
        if (includeDays) {
            req.validated.days = days;
        }

        next();
    };
}

module.exports = validateWeatherQuery;
