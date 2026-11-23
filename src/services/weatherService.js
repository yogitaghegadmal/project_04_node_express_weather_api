const AppError = require("../utils/appError");
const HTTP_STATUS = require("../constants/httpStatus");
const { describeWeatherCode } = require("../constants/weatherCodes");

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Call a public weather URL and return the parsed JSON body.
 * Network failures and non-OK responses become HTTP 502 because the
 * problem is in the upstream service, not in this application's validation.
 */
async function fetchJson(url) {
    let response;

    try {
        response = await fetch(url, {
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });
    } catch (error) {
        throw new AppError(
            "Weather service is unreachable. Please try again later.",
            HTTP_STATUS.BAD_GATEWAY
        );
    }

    if (!response.ok) {
        throw new AppError(
            "Weather service returned an unexpected response.",
            HTTP_STATUS.BAD_GATEWAY
        );
    }

    return response.json();
}

/**
 * Resolve a city name to coordinates using the Open-Meteo geocoding API.
 * An empty result means the city was not found, so the caller gets HTTP 404.
 */
async function findCity(city) {
    const url = new URL(GEOCODING_URL);
    url.searchParams.set("name", city);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const data = await fetchJson(url);

    if (!data.results || data.results.length === 0) {
        throw new AppError(
            `No city found for "${city}".`,
            HTTP_STATUS.NOT_FOUND
        );
    }

    const match = data.results[0];

    return {
        city: match.name,
        country: match.country || null,
        adminArea: match.admin1 || null,
        latitude: match.latitude,
        longitude: match.longitude,
        timezone: match.timezone || "auto"
    };
}

/**
 * Ask Open-Meteo for the current conditions and a daily forecast.
 * "days" controls how many daily rows are requested (1 to 7).
 */
async function fetchForecast(place, days) {
    const url = new URL(FORECAST_URL);
    url.searchParams.set("latitude", String(place.latitude));
    url.searchParams.set("longitude", String(place.longitude));
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m");
    url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
    url.searchParams.set("forecast_days", String(days));
    url.searchParams.set("timezone", place.timezone || "auto");

    const data = await fetchJson(url);

    if (!data.current || !data.daily) {
        throw new AppError(
            "Weather service did not return forecast data.",
            HTTP_STATUS.BAD_GATEWAY
        );
    }

    return data;
}

/**
 * Shape the current-weather payload the controller sends to the client.
 */
function buildCurrentWeather(place, forecast) {
    const current = forecast.current;

    return {
        city: place.city,
        country: place.country,
        adminArea: place.adminArea,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: forecast.timezone,
        current: {
            temperature: current.temperature_2m,
            temperatureUnit: forecast.current_units?.temperature_2m || "°C",
            humidity: current.relative_humidity_2m,
            humidityUnit: forecast.current_units?.relative_humidity_2m || "%",
            windSpeed: current.wind_speed_10m,
            windSpeedUnit: forecast.current_units?.wind_speed_10m || "km/h",
            condition: describeWeatherCode(current.weather_code),
            weatherCode: current.weather_code,
            observedAt: current.time
        }
    };
}

/**
 * Shape one daily forecast row.
 */
function buildForecastDay(forecast, index) {
    const daily = forecast.daily;

    return {
        date: daily.time[index],
        temperatureMax: daily.temperature_2m_max[index],
        temperatureMin: daily.temperature_2m_min[index],
        temperatureUnit: forecast.daily_units?.temperature_2m_max || "°C",
        condition: describeWeatherCode(daily.weather_code[index]),
        weatherCode: daily.weather_code[index]
    };
}

/**
 * Load current weather for a validated city name.
 */
async function getCurrentWeather(city) {
    const place = await findCity(city);
    const forecast = await fetchForecast(place, 1);
    return buildCurrentWeather(place, forecast);
}

/**
 * Load a multi-day forecast for a validated city name.
 */
async function getForecast(city, days) {
    const place = await findCity(city);
    const forecast = await fetchForecast(place, days);
    const dailyCount = forecast.daily.time?.length || 0;

    return {
        city: place.city,
        country: place.country,
        adminArea: place.adminArea,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: forecast.timezone,
        days: Array.from({ length: dailyCount }, (_, index) => buildForecastDay(forecast, index))
    };
}

module.exports = {
    getCurrentWeather,
    getForecast
};
