# Kisan Mitra - Open-Meteo API Specification

## Base URL

`https://api.open-meteo.com/v1`

------------------------------------------------------------------------

## 1. Weather Forecast API (`/forecast`)

Kisan Mitra uses the Open-Meteo Weather Forecast API to fetch
location-based weather information for the farmer dashboard and
weather-dependent farming decisions.

-   `GET /forecast` --- Fetch current, hourly, and/or daily weather data
    for a geographical location.
-   The request is based on the farmer's latitude and longitude.
-   The API returns weather data in JSON format.

------------------------------------------------------------------------

## 2. Request Parameters

### Required Parameters

-   `latitude` --- Latitude of the farmer's location.
-   `longitude` --- Longitude of the farmer's location.

### Weather Data Parameters

Kisan Mitra can request the weather variables required by the
application through the following Open-Meteo parameters:

-   `current` --- Current weather conditions.
-   `hourly` --- Hourly weather forecast variables.
-   `daily` --- Daily forecast variables.

### Common Configuration Parameters

-   `timezone=auto` --- Returns timestamps according to the location's
    timezone.
-   `forecast_days` --- Controls the number of forecast days.
-   `temperature_unit` --- Temperature unit.
-   `wind_speed_unit` --- Wind-speed unit.
-   `precipitation_unit` --- Precipitation unit.

------------------------------------------------------------------------

## 3. Example Request

``` http
GET https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto
```

------------------------------------------------------------------------

## 4. Weather Variables Used

The API supports a large number of weather variables. Kisan Mitra can
use the following variables for its farmer-facing weather and
decision-support features:

  ---------------------------------------------------------------------------------
  Variable                Open-Meteo Parameter              Use
  ----------------------- --------------------------------- -----------------------
  Temperature             `temperature_2m`                  Current/forecast
                                                            temperature

  Humidity                `relative_humidity_2m`            Weather and
                                                            crop-condition context

  Precipitation           `precipitation`                   Rainfall information

  Rain Probability        `precipitation_probability`       Rain-based planning

  Weather Code            `weather_code`                    Weather condition
                                                            display

  Wind Speed              `wind_speed_10m`                  Wind-related
                                                            information

  Daily Maximum           `temperature_2m_max`              Daily forecast
  Temperature                                               

  Daily Minimum           `temperature_2m_min`              Daily forecast
  Temperature                                               

  Daily Precipitation     `precipitation_sum`               Daily rainfall

  Daily Rain Probability  `precipitation_probability_max`   Rain-risk planning
  ---------------------------------------------------------------------------------

The exact variables requested by the application should match the values
used in the implemented frontend/backend code.

------------------------------------------------------------------------

## 5. Example Response

A simplified Open-Meteo response can contain the following structure:

``` json
{
  "latitude": 23.2599,
  "longitude": 77.4126,
  "timezone": "Asia/Kolkata",
  "current": {
    "temperature_2m": 28.5,
    "relative_humidity_2m": 62,
    "precipitation": 0,
    "weather_code": 1
  },
  "hourly": {
    "time": [],
    "temperature_2m": [],
    "precipitation_probability": [],
    "precipitation": []
  },
  "daily": {
    "time": [],
    "temperature_2m_max": [],
    "temperature_2m_min": [],
    "precipitation_sum": [],
    "precipitation_probability_max": []
  }
}
```

------------------------------------------------------------------------

## 6. Kisan Mitra Weather Flow

``` text
Farmer Location
      |
      v
Latitude + Longitude
      |
      v
Open-Meteo /forecast API
      |
      v
Weather JSON Response
      |
      v
Kisan Mitra Weather Module
      |
      +----------------------+
      |                      |
      v                      v
Weather Display       Farming Decisions
                              |
                              v
                    Irrigation / Risk
                    Recommendations
```

------------------------------------------------------------------------

## 7. Usage in Kisan Mitra

The Open-Meteo API provides the weather information required for
features such as:

-   Current weather display
-   Weather forecast
-   Rain probability
-   Precipitation information
-   Temperature monitoring
-   Weather-risk information
-   Irrigation-related recommendations
-   Farmer dashboard weather insights

------------------------------------------------------------------------

## 8. Location Handling

Open-Meteo requires geographical coordinates for forecast requests.

``` text
Farmer Location
      |
      v
Latitude
Longitude
      |
      v
Open-Meteo Forecast API
```

Example:

``` text
latitude=23.2599
longitude=77.4126
```

For production use, the application should pass the actual coordinates
associated with the farmer's selected or detected location.

------------------------------------------------------------------------

## 9. Error Handling

If the Open-Meteo request fails or returns unusable data, Kisan Mitra
should handle the failure without breaking the complete dashboard.

Possible cases include:

-   Invalid latitude or longitude
-   Network failure
-   API unavailable
-   Missing weather data
-   Invalid API response

The frontend should show a simple message such as:

``` text
Weather information is temporarily unavailable.
Please try again later.
```

Technical API errors should not be exposed directly to the farmer.

------------------------------------------------------------------------

## 10. Integration Notes

-   The Open-Meteo endpoint is accessed using HTTP GET.
-   Latitude and longitude are required.
-   JSON is used as the response format.
-   `timezone=auto` can be used to return local-time timestamps.
-   Only the weather variables required by Kisan Mitra should be
    requested.
-   Weather data should be handled through the application's configured
    API layer where applicable.
-   API failures should have a user-friendly fallback.

------------------------------------------------------------------------

## 11. Official Documentation

Open-Meteo API documentation:

https://open-meteo.com/en/docs
