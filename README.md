# Kisan Mitra - Smart Farming Decision Support System

> **Because a farmer's biggest risk isn't hard work - it's making the wrong decision at the wrong time.**
Kisan Mitra is a full-stack, AI-powered agricultural decision support platform that brings **weather intelligence, irrigation recommendations, crop-health monitoring, market-price insights, crop recommendation, government scheme discovery, and farm-specific actions** into one simple dashboard.

# Live Website

The deployed Kisan Mitra application is available online and is designed to
work across mobile phones, tablets, laptops, and desktop devices.

[Open Kisan Mitra - Live Website](https://kisanmitraaaa.netlify.app/)

# Project Model Demo

A demonstration of the Kisan Mitra farmer-support model is available on YouTube.

[Watch the Project Model on YouTube](https://youtu.be/APx-VRcGBFY)

## **"What should I do on my farm today?"**

# Project Status

Kisan Mitra separates implemented modules from planned improvements so that
the current product scope remains clear.

## Implemented vs Future

| Feature | Status |
|---|---|
| Farmer authentication | Implemented |
| Farm profile | Implemented |
| Weather information | Implemented |
| Irrigation recommendation | Implemented |
| Weather risk alerts | Implemented |
| AI-assisted crop health screening | Implemented |
| Market price insights | Implemented |
| Crop recommendation | Implemented |
| Government schemes recommendation | Implemented |
| Unified farmer dashboard | Implemented |
| Today's Farm Actions | Implemented |
| Voice assistant | Future |
| Community pest and disease alerts | Future |
| Fertilizer and resource planning | Future |
| Yield prediction | Future |

# Problem

Farmers continuously make high-impact decisions:
- Which crop should I grow?
- Should I irrigate today or wait for rain?
- Is upcoming weather dangerous for my crop?
- Is a crop showing signs of disease or pest damage?
- Should I sell now or wait for a better market price?
Relevant information exists across weather services, agricultural resources, mandi/market data, and crop-health information, but it is fragmented and often difficult to convert into an immediate action.
A wrong decision at the wrong time can lead to:
- unnecessary irrigation and water wastage
- crop damage from extreme weather
- delayed response to disease or pest symptoms
- poor selling decisions
- avoidable production losses
**Kisan Mitra** combines these signals into personalized, actionable recommendations for each farmer.
---

# Our Solution

The platform allows a farmer to:
1. Create a secure account.
2. Set up a farm profile.
3. Select location, land size, soil type, crop, and growth stage.
4. Receive real-time weather information.
5. Get weather-based irrigation recommendations.
6. Receive farming-relevant weather risk alerts.
7. Upload crop/leaf images for AI-assisted health screening.
8. View relevant mandi/commodity price trends.
9. Receive a unified "Today's Farm Actions" summary.
10. Access the platform from mobile or desktop.
---

# Core Product Concept

Instead of building separate weather, disease, and market widgets, the system uses a **Decision Engine**.
```text
          FARM PROFILE
  WEATHER      CROP      MARKET
           HEALTH
         DECISION ENGINE
   IRRIGATION    ALERT    SELL / HOLD
         TODAY'S ACTIONS
```
Example:
>  **Do not irrigate today**
> 22 mm rainfall is expected within the next 36 hours.
>  **Weather Risk: High**
> Heavy rainfall is expected. Avoid unnecessary irrigation and consider delaying field operations.
>  **Crop Health: Attention Required**
> The uploaded image shows symptoms that may indicate a fungal issue. Inspect lower leaves and field moisture conditions.
>  **Market Trend: Rising**
> Wheat prices have increased over the last 7 days.
---

# Key Features

## 1. Farmer Authentication

- Secure sign-up and login.
- Individual farmer accounts.
- Private farm data.
- User-specific access control using JWT-based authentication and protected application routes.
---

## 2. Farm Profile

Each farmer can configure:
- Farm location
- Land size
- Soil type
- Current/planned crop
- Crop growth stage
All recommendations are personalized using this information.
---

## 3. Weather Intelligence

The platform fetches forecast data for the farmer's location.
Weather signals include:
- Temperature
- Rainfall
- Rain probability
- Humidity
- Wind
- Evapotranspiration
- Soil-related weather variables where available
The system converts these values into farming-relevant information instead of simply displaying weather statistics.
---

## 4. Irrigation Decision Engine

The irrigation engine evaluates:
- Expected rainfall
- Rain probability
- Soil conditions
- Crop
- Crop growth stage
- Temperature
- Evapotranspiration
- Recent weather conditions
Example decisions:
```text
Rain expected
   v
Delay irrigation
Low rainfall probability
   +
Low soil moisture
   v
Irrigate soon
High rainfall
   +
Adequate expected precipitation
   v
Do not irrigate
```
The recommendation is designed to reduce unnecessary irrigation and help farmers make timing decisions.
---

## 5. Weather Risk Engine

The system evaluates farming-relevant risks such as:
- Heavy rainfall
- Extreme heat
- Frost
- Strong winds
- Excess humidity
- Dry/drought conditions
A simplified risk score can combine multiple signals:
```text
Rain Risk
+
Heat Risk
+
Wind Risk
+
Humidity/Dryness Risk
    v
Weather Risk Score
    v
LOW / MEDIUM / HIGH
```
---

## 6. AI Crop Health Monitoring

Farmers can upload a crop or leaf photograph and optionally add an observation.
The image is analyzed using a multimodal AI model.
The system can return:
- Possible crop
- Possible issue
- Confidence
- Severity
- Visual observations
- Suggested next checks
- Recommended next actions
Example:
```json
{
 "crop": "Wheat",
 "issue": "Possible fungal infection",
 "confidence": 0.78,
 "severity": "medium",
 "observations": [
  "yellowing leaves",
  "brown lesions"
 ],
 "recommended_actions": [
  "inspect lower leaves",
  "check field moisture",
  "seek local agricultural guidance if symptoms spread"
 ]
}
```

### Important safety principle

The system provides **AI-assisted screening**, not a laboratory diagnosis.
The interface should clearly communicate uncertainty and recommend professional/local agricultural verification for serious cases.
---

## 7. Market Price Insights

The system uses Indian mandi/commodity price data to provide:
- Current relevant price
- Recent price history
- Minimum price
- Maximum price
- Modal price where available
- 7-day trend
- 30-day trend
- Rising/falling/stable indication
Example:
```text
WHEAT
Current Modal Price
INR 2,420 / quintal
7-Day Change
+4.2%
30-Day Change
+8.7%
Trend
 Rising
```
The system can convert the trend into a simple decision-support signal such as:
**RISING / STABLE / FALLING**
This is informational decision support and not a guarantee of future prices.

## 7A. Crop Recommendation

Kisan Mitra provides a crop recommendation module to help farmers identify crops that may be suitable for their farm conditions.
The recommendation can consider the information available in the farmer profile and the application inputs.
Relevant factors can include:
- Farm location
- Soil type
- Season
- Weather conditions
- Water availability
- Crop suitability information

### Recommendation Flow

```text
Farm location + Soil + Season + Weather + Water
                    |
                    v
          Crop Recommendation Logic
                    |
                    v
          Suitable Crop Options
                    |
                    v
          Farmer Reviews Options
```
The feature is intended to support crop-selection decisions. It should not be treated as a guarantee of yield, profitability, or suitability under every local condition.
The recommendation can be presented in simple language so that the farmer can understand why a crop is being suggested.

## 8. Government Schemes Recommendation

Kisan Mitra also helps farmers discover relevant government agricultural schemes.
The feature is designed around a simple farmer workflow:
1. The farmer selects or provides relevant crop information.
2. The farmer provides applicable basic details when required.
3. Kisan Mitra evaluates the available scheme information.
4. The system identifies schemes that may be relevant to the selected situation.
5. The farmer can view scheme details in one place.
The Government Schemes section is intended to reduce the effort required to search through scattered information.

### Scheme Information

Depending on the available source data, a scheme entry can present:
- Scheme name
- Purpose
- Relevant agricultural category
- Eligibility information
- Benefits
- Important conditions
- Required documents, where available
- Application or official information source, where available

### Why This Feature Matters

Farmers may not know which government scheme is relevant to their crop, activity, or situation.
Kisan Mitra brings scheme discovery into the same platform as weather, crop, irrigation, market, and crop-health information.

### Decision Flow

```text
Farmer selects crop or requirement
            |
            v
Relevant scheme information
            |
            v
Eligibility and benefit details
            |
            v
Relevant scheme recommendations
            |
            v
Farmer reviews official information
```
The feature is intended as an information and discovery tool. Final eligibility and application decisions should always be verified against the applicable official government source.
---

# Implemented Product Modules

The current Kisan Mitra product combines the following implemented or product-defined modules:
- Farmer authentication
- Farm profile
- Weather information
- Weather-based irrigation recommendations
- Weather risk alerts
- AI-assisted crop-health screening
- Market price insights
- Crop recommendation
- Government schemes recommendation
- Unified farmer dashboard
- Today's Farm Actions
These modules are designed to work together so that the farmer receives useful actions instead of having to interpret each data source separately.
---

# 9. Today's Farm Actions

The most important dashboard component.
Instead of forcing the farmer to interpret multiple charts, the platform prioritizes actions.
Example:
```text
TODAY'S FARM ACTIONS
 HIGH PRIORITY
Do not irrigate today.
Rain expected within 36 hours.
 MEDIUM PRIORITY
Inspect wheat leaves for possible fungal symptoms.
 LOW PRIORITY
Market prices are trending upward.
```
This creates the experience of a **digital farming advisor** rather than a collection of unrelated tools.
---

# 9.  Unified Farmer Dashboard

The dashboard combines:
- Farm profile
- Crop status
- Weather
- Irrigation recommendation
- Weather risks
- Crop health
- Market prices
- Today's actions
The farmer should be able to understand the current situation within seconds.
---

# System Architecture

Kisan Mitra follows a modular architecture so that the farmer-facing interface,
business logic, authentication, database, and external services can evolve
independently.
```text
                         FARMER
                           |
                           v
                 +-------------------+
                 |   React Frontend  |
                 | Tailwind CSS UI   |
                 +---------+---------+
                           |
                           v
                 +-------------------+
                 |   Backend Layer   |
                 | Node.js / Express |
                 | Flask / Python   |
                 +---------+---------+
                           |
              +------------+------------+
              |                         |
              v                         v
      +---------------+          +-------------+
      | MongoDB       |          | Open-Meteo  |
      | Application   |          | Weather API |
      | Data          |          +-------------+
      +---------------+
              |
              v
      +-------------------+
      | Decision Modules  |
      | Crop / Weather /  |
      | Irrigation /      |
      | Schemes / Market  |
      +-------------------+
              |
              v
      +-------------------+
      | Farmer Actions    |
      | Clear and useful  |
      | recommendations   |
      +-------------------+
```

## Architecture Principles

- Keep the farmer interface simple.
- Keep business rules separate from presentation.
- Protect user-specific data with JWT authentication.
- Store application data in MongoDB.
- Consume weather information through Open-Meteo.
- Handle API failures without breaking the complete interface.
- Keep implemented features separate from planned features.
- Design the application so new recommendation modules can be added later.
---

# Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS |
| Frontend / Supporting Logic | Python where required for application or data-processing components |
| Backend | Node.js |
| Backend Framework | Express.js |
| Python Backend / Services | Flask |
| Database | MongoDB |
| Authentication | JWT |
| Weather API | Open-Meteo |
| Deployment | Netlify and Railway |
| Version Control | Git and GitHub |
| Application Architecture | REST-style API communication |

## API Integration

## Open-Meteo Weather API

Open-Meteo provides location-based forecast information used by Kisan Mitra.
The integration supports weather-driven features such as:
- Temperature
- Rainfall / precipitation
- Rain probability
- Humidity
- Wind
- Evapotranspiration where available
- Forecast-based farming decisions
```text
Farmer Location
      |
      v
Latitude / Longitude
      |
      v
Open-Meteo API
      |
      v
Forecast Data
      |
      v
Weather and Irrigation Logic
      |
      v
Farmer Recommendation
```
The application should handle API failures gracefully and should not expose
raw API errors directly to the farmer.

# Database Design

The database is designed around the farmer and their farm.
```text
users
  farm_profiles
      crops
      weather_records
      irrigation_recommendations
      weather_alerts
      crop_health_logs
      market_price_records
```

## Main Entities

### `farm_profiles`

Stores:
- Farmer ID
- Location
- Latitude
- Longitude
- Land size
- Soil type
- Created/updated timestamps

### `crops`

Stores:
- Farm ID
- Crop name
- Variety if available
- Growth stage
- Planting date
- Status

### `weather_records`

Stores:
- Farm ID
- Forecast date
- Temperature
- Rainfall
- Rain probability
- Humidity
- Wind
- Evapotranspiration
- Raw API data where required

### `irrigation_recommendations`

Stores:
- Farm ID
- Crop ID
- Recommendation
- Reason
- Confidence/score
- Generated timestamp

### `weather_alerts`

Stores:
- Farm ID
- Risk type
- Severity
- Forecast window
- Explanation
- Status

### `crop_health_logs`

Stores:
- Farm ID
- Crop ID
- Image URL
- Farmer description
- AI analysis
- Confidence
- Severity
- Timestamp

### `market_price_records`

Stores:
- Commodity
- Market
- Date
- Minimum price
- Maximum price
- Modal price
- Source
---

# Security

Security is an important part of Kisan Mitra because the application stores
farmer-specific information.

## Authentication

Kisan Mitra uses JWT-based authentication.
The application follows a protected-request model:
```text
Login
  |
  v
Credentials Verified
  |
  v
JWT Issued
  |
  v
Client Stores Token Securely
  |
  v
Token Sent With Protected Requests
  |
  v
Backend Validates Token
  |
  v
Request Allowed / Rejected
```

## Security Measures

The application should follow these practices:
- JWT-based authentication
- Protected API routes
- User-specific data access
- Input validation
- File upload validation
- Environment variables for secrets
- API error handling
- No hard-coded credentials
- Server-side validation of sensitive operations
- Safe handling of external API responses

## Data Isolation

A farmer should only be able to access their own:
- Farm profile
- Crop records
- Recommendations
- Weather-related history
- Crop health records
- Saved scheme information
- Personal dashboard information
---

# Responsive Design

The platform is designed **mobile-first** because many farmers may primarily access the application through smartphones.
UI principles:
- Large touch targets
- Simple language
- Minimal data entry
- Clear status indicators
- Icon-supported actions
- Color-coded severity
- Responsive cards
- Readable charts
- Simple navigation
---

# Error Handling

Kisan Mitra is designed to avoid blank or broken states when an external
service or user input fails.
| Situation | Expected Response |
|---|---|
| Weather API failure | Show a clear retry/fallback message |
| Invalid location | Ask the farmer to verify the location |
| Unsupported crop | Explain that the recommendation is unavailable |
| Image upload failure | Show supported format/size guidance |
| AI analysis failure | Preserve the uploaded image and allow retry |
| Invalid form data | Show field-level validation messages |
| Unauthorized request | Reject the request and ask the user to authenticate |
The interface should communicate failures in simple language rather than
exposing technical server errors to the farmer.

# Future Features

The following features are planned for future versions of Kisan Mitra.
They are intentionally separated from the implemented product scope.

## 1. Voice-Based Farming Assistant

Farmers can ask farming questions using voice or simple regional-language
conversation.
Example:
```text
Farmer:
"Should I water my wheat field today?"
Assistant:
"Rain is expected soon. Consider delaying irrigation."
```
Potential future support includes:
- Hindi
- English
- Punjabi
- Marathi
- Other regional languages

## 2. Community Pest and Disease Alerts

Farmers could optionally report crop-health issues.
Nearby reports could be aggregated using:
- Crop type
- Location
- Symptoms
- Time
- Similar observations
A possible workflow:
```text
Multiple Reports
      |
      v
Same Crop
      |
      v
Nearby Locations
      |
      v
Similar Symptoms
      |
      v
Possible Outbreak Signal
      |
      v
Community Alert
```

## 3. Fertilizer and Resource Planning

Future recommendations could consider:
- Crop
- Soil
- Growth stage
- Soil test results
- Nutrient deficiencies
- Water availability
The goal would be to help farmers plan resources more efficiently.

## 4. Yield Prediction

A future version could estimate expected production using:
- Crop
- Cultivated area
- Weather history
- Crop health
- Historical yield
- Soil information
The output would be an estimate for planning rather than a guaranteed result.

# Example User Journey

### Step 1 - Sign Up

Farmer creates an account.

### Step 2 - Farm Setup

```text
Location: Karnal, Haryana
Land: 5 acres
Soil: Loamy
Crop: Wheat
Growth Stage: Tillering
```

### Step 3 - Weather Analysis

System fetches forecast data.

### Step 4 - Irrigation Decision

Rainfall forecast is analyzed.
Result:
> **DO NOT IRRIGATE TODAY**

### Step 5 - Crop Health

Farmer uploads a leaf image.
AI identifies possible symptoms.

### Step 6 - Market

System displays recent wheat mandi prices.

### Step 7 - Unified Recommendation

Dashboard summarizes:
```text
TODAY
 Don't irrigate
 Inspect crop health
 Monitor wheat price trend
```
---

# Local Development

## Prerequisites

- Node.js and npm
- Python and pip
- MongoDB
- Git

## Setup

```bash
git clone <REPOSITORY_URL>
cd kisan-mitra
```
Install frontend and backend dependencies:
```bash
npm install
```
Install Python dependencies when the Flask service is used:
```bash
pip install -r requirements.txt
```

## Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
OPEN_METEO_BASE_URL=
```
Never commit real credentials or secrets.

## Run

Start the required backend service and then run the React frontend using the
project's configured development commands.

# Deployment

Kisan Mitra uses Netlify and Railway as deployment services.
```text
Git Repository
      |
      +----------------------+
      |                      |
      v                      v
   Netlify                Railway
   Frontend              Backend
      |                      |
      +----------+-----------+
                 |
                 v
              MongoDB
```

## Deployment Checklist

- Configure production environment variables.
- Configure MongoDB.
- Configure JWT secret.
- Configure frontend API URL.
- Deploy the frontend to Netlify.
- Deploy backend services through Railway.
- Verify CORS and protected routes.
- Test authentication.
- Test Open-Meteo requests.
- Test crop recommendations.
- Test government scheme recommendations.
- Test mobile layouts and error states.

# Success Metrics

The project will be evaluated internally using:

### Technical

- Authentication works
- Database persistence works
- APIs return usable data
- Recommendations are generated correctly
- Image analysis works
- Application remains functional during API failures

### User Experience

- Farmer can complete onboarding quickly
- Dashboard communicates priorities immediately
- Mobile UI is easy to navigate
- Recommendations explain **why** an action is suggested

### Product Impact

The system should help reduce:
- unnecessary irrigation
- delayed response to crop-health problems
- weather-related decision errors
- information fragmentation
- poor market timing decisions
---

# Why This Solution Is Different

Many agricultural applications display information.
**Smart Farm Decision Support System turns information into decisions.**
Instead of:
> "Rain probability: 82%"
we provide:
>  **Don't irrigate today - significant rain is expected within 36 hours.**
Instead of:
> "Temperature: 36C"
we provide:
>  **Heat risk is high - monitor crop stress and avoid unnecessary field operations during peak heat.**
Instead of:
> "Wheat price: INR 2,420"
we provide:
>  **Wheat prices are trending upward over the recent period. Consider monitoring before selling.**
The central principle is:

# **Data -> Intelligence -> Action**

---

# Future Vision

The long-term vision is to build a **personalized digital farming advisor** that continuously understands:
```text
WHO
Farmer + Farm
WHAT
Crop + Growth Stage
WHERE
Location + Soil
WHEN
Season + Weather
WHAT IS HAPPENING
Crop Health + Market
WHAT TO DO
Decision Engine
```
This can evolve into a regional-language, voice-enabled and eventually offline-capable agricultural assistant for small and mid-sized farmers.
---

# Team

## Team Kisan Mitra

Kisan Mitra was developed by:
| Team Member |
|---|
| Dhruv Bhola |
| Aditya Singh |
| Himani |
| Avni Jain |
The team worked collaboratively across:
- Product planning
- Frontend development
- Backend development
- Database integration
- API integration
- Recommendation features
- Testing
- Documentation
- Deployment
The contribution areas may overlap because the project was developed through
continuous collaboration, debugging, testing, and review.
---

# Project Deliverables

The project includes or is intended to include:
- [ ] Fully functional deployed application
- [ ] React frontend
- [ ] Backend services
- [ ] MongoDB database
- [ ] JWT authentication
- [ ] Open-Meteo integration
- [ ] Crop recommendation module
- [ ] Government schemes module
- [ ] Weather and irrigation module
- [ ] Crop health module
- [ ] Farmer dashboard
- [ ] Architecture documentation
- [ ] API documentation
- [ ] Complete README
- [ ] Demo-ready farmer workflow
---

# License

This project was developed as a collaborative technology project.

---

# Final Vision

> **A farmer should not need to understand APIs, weather models, market datasets, or AI.**
>
> **They should simply open the app and know what to do next.**

## Kisan Mitra

### **Know your farm. Understand the risk. Make the right decision at the right time.**
