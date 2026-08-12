# 🌾 Smart Farm Decision Support System

> **Because a farmer's biggest risk isn't hard work — it's making the wrong decision at the wrong time.**

A full-stack, AI-powered agricultural decision support platform that brings **weather intelligence, irrigation recommendations, crop-health monitoring, market-price insights, and farm-specific actions** into one simple dashboard.

The goal is not to show farmers more data. The goal is to answer one practical question:

## **“What should I do on my farm today?”**

---

## 🚀 Problem

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

**Smart Farm Decision Support System** combines these signals into personalized, actionable recommendations for each farmer.

---

# 💡 Our Solution

The platform allows a farmer to:

1. Create a secure account.
2. Set up a farm profile.
3. Select location, land size, soil type, crop, and growth stage.
4. Receive real-time weather information.
5. Get weather-based irrigation recommendations.
6. Receive farming-relevant weather risk alerts.
7. Upload crop/leaf images for AI-assisted health screening.
8. View relevant mandi/commodity price trends.
9. Receive a unified “Today's Farm Actions” summary.
10. Access the platform from mobile or desktop.

---

# 🎯 Core Product Concept

Instead of building separate weather, disease, and market widgets, the system uses a **Decision Engine**.

```text
                    FARM PROFILE
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
     WEATHER            CROP            MARKET
        │              HEALTH              │
        │                │                 │
        └────────────────┼─────────────────┘
                         ▼
                  DECISION ENGINE
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      IRRIGATION       ALERT        SELL / HOLD
                         │
                         ▼
                  TODAY'S ACTIONS
```

The system converts raw data into practical recommendations.

Example:

> 🌧️ **Do not irrigate today**  
> 22 mm rainfall is expected within the next 36 hours.

> ⚠️ **Weather Risk: High**  
> Heavy rainfall is expected. Avoid unnecessary irrigation and consider delaying field operations.

> 🌱 **Crop Health: Attention Required**  
> The uploaded image shows symptoms that may indicate a fungal issue. Inspect lower leaves and field moisture conditions.

> 📈 **Market Trend: Rising**  
> Wheat prices have increased over the last 7 days.

---

# ✨ Key Features

## 1. 🔐 Farmer Authentication

- Secure sign-up and login.
- Individual farmer accounts.
- Private farm data.
- Database-level authorization using Row Level Security.

---

## 2. 🚜 Farm Profile

Each farmer can configure:

- Farm location
- Land size
- Soil type
- Current/planned crop
- Crop growth stage

All recommendations are personalized using this information.

---

## 3. 🌦️ Weather Intelligence

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

## 4. 💧 Irrigation Decision Engine

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
      ↓
Delay irrigation

Low rainfall probability
      +
Low soil moisture
      ↓
Irrigate soon

High rainfall
      +
Adequate expected precipitation
      ↓
Do not irrigate
```

The recommendation is designed to reduce unnecessary irrigation and help farmers make timing decisions.

---

## 5. ⚠️ Weather Risk Engine

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
        ↓
Weather Risk Score
        ↓
LOW / MEDIUM / HIGH
```

---

## 6. 🌱 AI Crop Health Monitoring

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

## 7. 📈 Market Price Insights

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
₹2,420 / quintal

7-Day Change
+4.2%

30-Day Change
+8.7%

Trend
📈 Rising
```

The system can convert the trend into a simple decision-support signal such as:

**RISING / STABLE / FALLING**

This is informational decision support and not a guarantee of future prices.

---

# 8. 🧠 Today's Farm Actions

The most important dashboard component.

Instead of forcing the farmer to interpret multiple charts, the platform prioritizes actions.

Example:

```text
TODAY'S FARM ACTIONS

🔴 HIGH PRIORITY
Do not irrigate today.
Rain expected within 36 hours.

🟠 MEDIUM PRIORITY
Inspect wheat leaves for possible fungal symptoms.

🟢 LOW PRIORITY
Market prices are trending upward.
```

This creates the experience of a **digital farming advisor** rather than a collection of unrelated tools.

---

# 9. 📊 Unified Farmer Dashboard

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

# 🏗️ System Architecture

```text
                         ┌─────────────────┐
                         │     FARMER      │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      Next.js / React    │
                    │   Mobile-first Frontend │
                    └────────────┬────────────┘
                                 │
                   ┌─────────────┼─────────────┐
                   │             │             │
                   ▼             ▼             ▼
             ┌──────────┐  ┌───────────┐  ┌──────────┐
             │ Supabase│  │ API Layer │  │  Gemini  │
             │ Auth/DB │  │ /Server    │  │  Vision  │
             │ Storage │  │ Actions    │  │          │
             └────┬─────┘  └─────┬─────┘  └──────────┘
                  │              │
                  │       ┌──────┴────────┐
                  │       │               │
                  ▼       ▼               ▼
             PostgreSQL  Open-Meteo   AGMARKNET/
                          Weather      OGD Market Data
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide |
| Backend | Next.js API Routes / Server Actions |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| AI / Vision | Gemini API |
| Weather | Open-Meteo |
| Market Data | Government OGD / AGMARKNET |
| Charts | Recharts |
| Maps | Leaflet / OpenStreetMap |
| Version Control | Git + GitHub |
| Deployment | Vercel |
| AI Development Tools | Cursor / Lovable / Replit Agent |

---

# 🔌 Third-Party APIs & Data Sources

## Weather — Open-Meteo

**Source:** Open-Meteo

Open-Meteo provides forecast variables useful for agriculture, including precipitation, precipitation probability, temperature, wind, evapotranspiration and soil-related variables where available.

### Why we selected it

- Suitable for location-based forecasts
- Useful precipitation data
- Useful for irrigation logic
- Provides agriculture-relevant variables
- Easy REST API integration
- Suitable for rapid prototyping

### Integration

```text
Farmer Location
      ↓
Latitude / Longitude
      ↓
Open-Meteo API
      ↓
Forecast Data
      ↓
Weather Risk Engine
      ↓
Irrigation Engine
      ↓
Farmer Recommendation
```

Documentation:

https://open-meteo.com/en/docs

---

## Market Prices — Government OGD / AGMARKNET

The project uses Indian agricultural market/mandi price data from the Government of India's Open Government Data ecosystem, where available for the selected commodities and markets.

The data can provide market-level values such as:

- Minimum price
- Maximum price
- Modal price
- Commodity
- Market
- Date

### Why we selected it

- Indian agricultural market context
- Government data source
- Relevant to farmer selling decisions
- Suitable for trend analysis

Source:

https://www.data.gov.in/

---

## Crop Health — Gemini Vision

A multimodal Gemini model is used for image-assisted crop health screening.

### Input

```text
Crop Image
+
Farmer Description
+
Crop Information
```

### Output

```text
Possible Issue
Confidence
Severity
Observations
Recommended Next Steps
```

The model output is treated as an AI-assisted screening result rather than definitive agricultural diagnosis.

---

# 🗄️ Database Design

The database is designed around the farmer and their farm.

```text
users
  │
  └── farm_profiles
          │
          ├── crops
          │
          ├── weather_records
          │
          ├── irrigation_recommendations
          │
          ├── weather_alerts
          │
          ├── crop_health_logs
          │
          └── market_price_records
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

# 🔐 Security

Security is a core requirement.

The application uses:

- Authentication
- Secure session handling
- Environment variables for API keys
- Supabase Row Level Security
- User-specific database access
- Server-side handling of sensitive API keys
- File upload validation
- API error handling

### Data isolation

A farmer must only be able to access their own:

- Farm profiles
- Crop records
- Weather history
- Irrigation history
- Crop health logs
- Personal dashboard data

---

# 📱 Responsive Design

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

# 🚨 Error Handling

The system handles common failure cases gracefully.

### Weather API failure

```text
Unable to fetch live weather data.

Last available forecast:
2 hours ago

[Retry]
```

### Invalid location

```text
We couldn't identify this location.

Please check the village/city name.
```

### Unsupported crop

```text
This crop is not currently supported by
the recommendation engine.

You can continue using weather and
market features.
```

### Image upload failure

```text
Upload failed.

Please upload a JPG, PNG or WebP image
under the supported file size.
```

### AI analysis failure

```text
Crop analysis is temporarily unavailable.

Your image has been saved.
Try analysis again later.
```

The UI should never show a blank or broken state.

---

# 🌾 Optional / Future Features

The architecture is designed to support additional modules.

## Crop Recommendation Engine

Recommend crops using:

- Location
- Soil
- Season
- Weather
- Water availability
- Historical suitability

---

## 🎤 Voice-Based Farming Assistant

Farmers can ask questions in regional languages.

Example:

> “क्या आज गेहूं में पानी देना चाहिए?”

The system can respond:

> “आज सिंचाई न करें। अगले 36 घंटों में बारिश की संभावना है।”

Potential future support:

- Hindi
- English
- Punjabi
- Marathi
- Other regional languages

---

## 🦠 Community Pest/Disease Alerts

Farmers can optionally report crop-health issues.

Nearby reports can be aggregated:

```text
Multiple reports
      ↓
Same crop
      +
Nearby locations
      +
Similar symptoms
      ↓
Possible outbreak signal
```

---

## 🧪 Fertilizer & Resource Planning

Future recommendations can consider:

- Crop
- Soil
- Growth stage
- Soil test results
- Nutrient deficiencies

---

## 📊 Yield Prediction

Future versions can combine:

- Crop
- Area
- Weather history
- Crop health
- Historical yield
- Soil information

to estimate expected production.

---

## 📶 Offline-First Support

A future version can cache:

- Farm profile
- Latest recommendations
- Recent weather
- Crop-health history

and synchronize data when connectivity returns.

---

# 🧪 Example User Journey

### Step 1 — Sign Up

Farmer creates an account.

### Step 2 — Farm Setup

```text
Location: Karnal, Haryana
Land: 5 acres
Soil: Loamy
Crop: Wheat
Growth Stage: Tillering
```

### Step 3 — Weather Analysis

System fetches forecast data.

### Step 4 — Irrigation Decision

Rainfall forecast is analyzed.

Result:

> **DO NOT IRRIGATE TODAY**

### Step 5 — Crop Health

Farmer uploads a leaf image.

AI identifies possible symptoms.

### Step 6 — Market

System displays recent wheat mandi prices.

### Step 7 — Unified Recommendation

Dashboard summarizes:

```text
TODAY

🔴 Don't irrigate
🟠 Inspect crop health
🟢 Monitor wheat price trend
```

---

# 📁 Suggested Repository Structure

```text
smart-farm-decision-support/
│
├── app/
│   ├── dashboard/
│   ├── farm/
│   ├── crop-health/
│   ├── market/
│   ├── weather/
│   ├── login/
│   └── api/
│
├── components/
│   ├── dashboard/
│   ├── weather/
│   ├── irrigation/
│   ├── crop-health/
│   ├── market/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── weather/
│   ├── market/
│   ├── ai/
│   └── decision-engine/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── public/
│
├── docs/
│   ├── architecture-diagram.png
│   └── api-documentation.md
│
├── README.md
├── package.json
└── .env.example
```

---

# ⚙️ Local Development

## 1. Clone repository

```bash
git clone <REPOSITORY_URL>
cd smart-farm-decision-support
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

GEMINI_API_KEY=

WEATHER_API_URL=

MARKET_API_KEY=
```

Never commit real API keys to GitHub.

## 4. Run development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🚀 Deployment

Recommended deployment:

```text
GitHub
   ↓
Vercel
   ↓
Next.js Application
   ↓
Supabase
```

Deployment checklist:

- Configure production environment variables.
- Configure Supabase production project.
- Apply database schema.
- Configure authentication redirect URLs.
- Configure storage policies.
- Deploy to Vercel.
- Test all API integrations.
- Test mobile layout.
- Test error states.

---

# 🧑‍💻 Development Strategy

Development is divided into independent modules.

### Phase 1 — Foundation

- Project setup
- UI system
- Authentication
- Supabase
- Farm onboarding

### Phase 2 — Decision Engine

- Weather API
- Irrigation engine
- Weather risk engine

### Phase 3 — Intelligence

- Crop health AI
- Market price analysis
- Decision score

### Phase 4 — Experience

- Unified dashboard
- Mobile optimization
- Voice assistant
- Community alerts

### Phase 5 — Delivery

- Testing
- Error handling
- Deployment
- Documentation
- Presentation

---

# 📝 Git Commit Strategy

The repository follows small, meaningful commits.

Examples:

```bash
git commit -m "feat(auth): implement farmer authentication"
git commit -m "feat(farm): add farm profile onboarding"
git commit -m "feat(weather): integrate Open-Meteo forecast service"
git commit -m "feat(irrigation): add rainfall-based irrigation engine"
git commit -m "feat(weather): add farming risk classification"
git commit -m "feat(health): add crop image upload"
git commit -m "feat(ai): integrate crop health analysis"
git commit -m "feat(market): add mandi price trend analysis"
git commit -m "feat(dashboard): add today's farm actions"
git commit -m "fix(api): handle external API failures gracefully"
```

During the hackathon, the team targets approximately **10 meaningful commits per development day**, without using meaningless commits only to increase the count.

---

# 📊 Success Metrics

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
- Recommendations explain *why* an action is suggested

### Product Impact

The system should help reduce:

- unnecessary irrigation
- delayed response to crop-health problems
- weather-related decision errors
- information fragmentation
- poor market timing decisions

---

# 🏆 Why This Solution Is Different

Many agricultural applications display information.

**Smart Farm Decision Support System turns information into decisions.**

Instead of:

> “Rain probability: 82%”

we provide:

> 🌧️ **Don't irrigate today — significant rain is expected within 36 hours.**

Instead of:

> “Temperature: 36°C”

we provide:

> ⚠️ **Heat risk is high — monitor crop stress and avoid unnecessary field operations during peak heat.**

Instead of:

> “Wheat price: ₹2,420”

we provide:

> 📈 **Wheat prices are trending upward over the recent period. Consider monitoring before selling.**

The central principle is:

# **Data → Intelligence → Action**

---

# 🔮 Future Vision

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

# 👥 Team

**HackInMotion — TeamCode**

Team members:

- Member 1
- Member 2
- Member 3
- Member 4

---

# 📄 Hackathon Deliverables

The repository contains / will contain:

- [ ] Fully functional deployed application
- [ ] Frontend
- [ ] Backend
- [ ] Database
- [ ] `architecture-diagram.png`
- [ ] `api-documentation.md`
- [ ] `presentation.pptx`
- [ ] Complete `README.md`
- [ ] API/data-source documentation
- [ ] Demo-ready farmer workflow

---

# 📜 License

This project was developed as a hackathon project.

License and usage terms can be added based on the team's requirements.

---

# 🌾 Final Vision

> **A farmer should not need to understand APIs, weather models, market datasets, or AI.**
>
> **They should simply open the app and know what to do next.**

## Smart Farm Decision Support System

### **Know your farm. Understand the risk. Make the right decision at the right time.**
