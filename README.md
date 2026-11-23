# Weather API

A beginner Node.js and Express API that returns the current weather and a short daily forecast for a city. Weather data comes from the free [Open-Meteo](https://open-meteo.com/) service, so you do not need an API key.


## What you need

- [Node.js](https://nodejs.org/) 18 or newer (the app uses the built-in `fetch`)
- npm (installed with Node.js)

Check your version:

```bash
node -v
```

## How to run it

1. Open a terminal in this project folder.
2. Install the packages (only needed the first time, or after `package.json` changes):

```bash
npm install
```

3. Start the server. `nodemon` restarts it when you save a file:

```bash
npm start
```

4. Open these URLs:

- App home: http://localhost:8011/
- Health check: http://localhost:8011/health
- Current weather: http://localhost:8011/api/weather?city=London
- 3-day forecast: http://localhost:8011/api/weather/forecast?city=Mumbai&days=3
- Swagger docs: http://localhost:8011/api-docs

The port is `8011` unless you set `PORT` before starting:

```bash
# PowerShell
$env:PORT = 3000; npm start
```

## Endpoints

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/` | Lists the main URLs |
| `GET` | `/health` | Confirms the server is running |
| `GET` | `/api/weather?city=London` | Current temperature, humidity, wind, and condition |
| `GET` | `/api/weather/forecast?city=London&days=3` | Daily high, low, and condition. `days` is optional and defaults to 3 |
| `GET` | `/api-docs` | Swagger UI |

### Example success response

`GET /api/weather?city=London` returns HTTP `200`:

```json
{
  "status": "success",
  "data": {
    "city": "London",
    "country": "United Kingdom",
    "current": {
      "temperature": 11.2,
      "temperatureUnit": "°C",
      "humidity": 82,
      "windSpeed": 14.4,
      "windSpeedUnit": "km/h",
      "condition": "Partly cloudy"
    }
  }
}
```

## Validation

The `validateWeatherQuery` middleware checks the query string before any weather request is made.

| Field | Rules |
| --- | --- |
| `city` | Required. 2 to 80 characters. Letters, spaces, dots, apostrophes, and hyphens only. |
| `days` | Forecast route only. Optional. A whole number from 1 to 7. Defaults to 3. |

A failed check returns HTTP `400`:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "city",
      "message": "Query parameter \"city\" is required. Example: ?city=London"
    }
  ]
}
```

## Status codes

| Code | When you get it |
| --- | --- |
| `200` | The request succeeded |
| `400` | The query is missing or invalid |
| `404` | The city was not found, or the path does not exist |
| `500` | An unexpected error inside this app |
| `502` | Open-Meteo could not be reached or returned a bad response |

## Project layout

```text
index.js                          starts Express and mounts middleware and routers
src/config/swagger.js             OpenAPI / Swagger setup
src/constants/httpStatus.js       status code numbers used by the app
src/constants/weatherCodes.js     turns weather codes into words
src/controllers/weatherController.js   sends the HTTP response
src/middleware/requestLogger.js   logs method, path, status, and time
src/middleware/validateWeatherQuery.js   checks city and days
src/middleware/notFound.js        404 for unknown paths
src/middleware/errorHandler.js    turns thrown errors into JSON
src/routes/weatherRoutes.js       /api/weather routes
src/routes/healthRoutes.js        /health route
src/services/weatherService.js    calls Open-Meteo
src/utils/appError.js             error that carries a status code
```

## Try these on purpose

```text
http://localhost:8011/api/weather
http://localhost:8011/api/weather?city=123
http://localhost:8011/api/weather/forecast?city=Pune&days=9
http://localhost:8011/api/weather?city=NotARealCityzzzz
http://localhost:8011/missing
```

Those should return `400`, `400`, `400`, `404`, and `404`.
