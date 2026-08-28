# Smart Crop --- Final Page, Route, Backend & Project Structure Specification

## 1. Purpose

This document is the final implementation specification for the Smart
Crop application.

It combines the two supplied page specifications and resolves the main
structural gaps:

-   Add all remaining pages required by the UI flow.
-   Arrange pages according to user role, business logic, and routes.
-   Define how frontend pages connect to backend APIs.
-   Use **AWS RDS as the primary relational database** instead of
    InsForge.
-   Use **Gemini API for all AI-related processing**.
-   Remove duplicate/unused folders and pages containing the same or
    obsolete code.
-   Rename folders/files using a consistent naming convention.
-   Keep farmer, agriculture officer, government, and bank/insurance
    access separated.
-   Maintain role-based authorization and backend security.
-   Keep AI, database, authentication, and business logic on the backend
    rather than exposing secrets in the frontend.

The original page catalogue contains 23 core modules and 38+
routes/aliases. The UI specification defines the main farmer, officer,
government, and bank/insurance journeys. These requirements are the
source of truth for the structure below.

------------------------------------------------------------------------

# 2. Final Architecture

``` text
                    SMART CROP
                        |
                Next.js Frontend
                        |
                 Backend API Layer
                        |
        +---------------+----------------+
        |               |                |
   Auth Service    Business APIs      AI Service
        |               |                |
        |               |          Gemini API
        |               |
        +-------+-------+
                |
             AWS RDS
                |
        PostgreSQL Database
                |
     +----------+----------+
     |          |          |
   Users      Farms      Crops
     |          |          |
 Applications  Risk     Market/Weather
     |          |          |
 Insurance   Alerts    Interventions
```

## Storage principle

AWS RDS is the application database.

Use PostgreSQL on AWS RDS for:

-   Users
-   Roles
-   Farmer profiles
-   Farms/plots
-   Crops
-   Crop activities
-   Crop monitoring data
-   Soil data
-   Weather data/cache
-   Market/mandi data/cache
-   Risk scores
-   AI recommendations
-   Notifications
-   Government schemes
-   Equipment
-   Equipment rentals
-   Insurance records
-   Financial facilities
-   Loan applications
-   Officer interventions
-   Audit logs

Do not use InsForge as the application database.

> RDS is the relational database. Object/file storage such as uploaded
> documents or images should use an object-storage service such as
> Amazon S3, while the RDS database stores metadata, paths, ownership,
> and status.

------------------------------------------------------------------------

# 3. AI Architecture --- Gemini API

All AI-related processing must go through the backend AI service.

``` text
Frontend
   |
   | request
   v
Backend API
   |
   v
AI Service
   |
   v
Gemini API
   |
   v
Structured AI Result
   |
   +----> AWS RDS
   |
   +----> Frontend
```

## Gemini responsibilities

Gemini can handle:

-   Crop distress explanation
-   Crop risk reasoning
-   Crop advisory
-   Alternative crop recommendation
-   Farming recommendations
-   Disease/pest explanation
-   Natural-language farmer assistance
-   Multilingual/Odia assistance
-   AI agronomist chat
-   Recommendation summaries
-   Intervention suggestions
-   Farmer-friendly explanations of sensor/weather/market information

## Important rule

The Gemini API key must NEVER be placed in:

``` text
NEXT_PUBLIC_*
frontend JavaScript
React components
browser local storage
```

The frontend calls the backend, and the backend calls Gemini.

``` text
POST /api/ai/risk-explanation
POST /api/ai/crop-advisory
POST /api/ai/alternative-crop
POST /api/ai/chat
```

------------------------------------------------------------------------

# 4. Authentication & Authorization

## Authentication routes

``` text
/authentication
/login
/register
/onboarding
/forgot-password
```

The existing unified authentication concept supports:

-   Farmer
-   Agriculture Officer
-   Bank Partner

Government users can be supported as an additional protected role if
required by the final implementation.

## Login flow

``` text
User
 |
 v
Login Page
 |
 v
POST /api/auth/login
 |
 v
Validate credentials
 |
 v
Create secure session/token
 |
 v
Check role
 |
 +---- Farmer ----------> /dashboard
 |
 +---- Officer ---------> /officer-dashboard
 |
 +---- Government ------> /government/dashboard
 |
 +---- Bank/Insurance --> /bank-insurance/dashboard
```

## Authorization

Every protected backend route must verify:

1.  Authentication
2.  User identity
3.  User role
4.  Resource ownership
5.  Required permission

Never rely only on hiding frontend pages.

Example:

``` text
Farmer cannot call:
GET /api/officer/farmers

Bank user cannot modify:
POST /api/government/schemes

Farmer cannot call:
POST /api/bank/facilities
```

------------------------------------------------------------------------

# 5. FINAL FRONTEND ROUTE STRUCTURE

Recommended Next.js App Router structure:

``` text
app/
│
├── authentication/
│   └── page.tsx
│
├── onboarding/
│   └── page.tsx
│
├── dashboard/
│   └── page.tsx
│
├── risk-details/
│   └── page.tsx
│
├── recommended-actions/
│   └── page.tsx
│
├── crop-monitoring/
│   └── page.tsx
│
├── crop-details/
│   └── page.tsx
│
├── full-crop-guide/
│   └── page.tsx
│
├── alternative-crop/
│   └── page.tsx
│
├── market/
│   └── page.tsx
│
├── equipment/
│   ├── page.tsx
│   └── [equipmentId]/
│       └── page.tsx
│
├── insurance/
│   └── page.tsx
│
├── schemes/
│   ├── page.tsx
│   └── [schemeId]/
│       └── page.tsx
│
├── notifications/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
├── farmer-profile/
│   └── page.tsx
│
├── financial-support/
│   ├── page.tsx
│   ├── detail/
│   │   └── page.tsx
│   └── acknowledgement/
│       └── page.tsx
│
├── officer-dashboard/
│   ├── page.tsx
│   └── farmers/
│       ├── page.tsx
│       └── [farmerId]/
│           └── page.tsx
│
├── government/
│   └── dashboard/
│       └── page.tsx
│
├── bank-insurance/
│   └── dashboard/
│       └── page.tsx
│
└── unauthorized/
    └── page.tsx
```

------------------------------------------------------------------------

# 6. FARMER PAGE FLOW

## 6.1 Farmer Dashboard

### Route

``` text
/dashboard
```

### Purpose

The main farmer screen answers:

``` text
How is my crop?
Why is it at risk?
What should I do today?
What support is available?
```

### Backend

``` text
GET /api/farmer/dashboard
```

Backend combines:

-   Farmer profile
-   Active farm
-   Current crop
-   Crop health
-   Soil
-   Weather
-   Market
-   Risk score
-   Today's activities
-   Notifications
-   Recommendations

### Flow

``` text
Dashboard
 |
 +--> Risk Details
 |
 +--> Crop Monitoring
 |
 +--> Crop Details
 |
 +--> Alternative Crop
 |
 +--> Market
 |
 +--> More
       |
       +--> Equipment
       +--> Insurance
       +--> Schemes
       +--> Notifications
       +--> Profile
```

------------------------------------------------------------------------

# 7. RISK DETAILS PAGE --- NEW REQUIRED PAGE

## Route

``` text
/risk-details
```

## Purpose

Explain why the farmer has a particular distress score.

Example:

``` text
81 / 100
HIGH RISK

Weather Risk
Market Risk
Financial Risk
Crop Health Risk
Soil Risk
```

## Backend

``` text
GET /api/farmer/risk
GET /api/farmer/risk/history
POST /api/ai/risk-explanation
```

## Logic

``` text
Crop data
+
Soil data
+
Weather data
+
Market data
+
Financial information
+
Historical crop health
        |
        v
Risk Engine
        |
        v
Risk Score
        |
        v
Gemini
        |
        v
Human-readable explanation
```

## Output

Store:

``` text
risk_score
risk_level
risk_factors
risk_history
ai_explanation
recommended_actions
created_at
```

------------------------------------------------------------------------

# 8. RECOMMENDED ACTIONS / INTERVENTION PAGE --- NEW

## Route

``` text
/recommended-actions
```

## Purpose

Convert risk information into practical actions.

Example:

``` text
1. Check soil moisture today
2. Inspect crop after rainfall
3. Consider alternative crop
4. Check insurance eligibility
5. Contact agriculture officer
```

## Backend

``` text
GET /api/farmer/recommendations
POST /api/ai/recommendations
POST /api/farmer/actions/:id/complete
```

## Logic

``` text
Risk
 |
 +--> Weather condition
 +--> Soil condition
 +--> Crop condition
 +--> Market condition
 +--> Financial condition
 |
 v
Gemini
 |
 v
Recommended Actions
 |
 v
Farmer
 |
 +--> Complete
 +--> Ignore
 +--> Ask AI
 +--> Contact Officer
```

------------------------------------------------------------------------

# 9. CROP MONITORING

## Route

``` text
/crop-monitoring
```

## Backend APIs

``` text
GET /api/crops/current
GET /api/crops/:cropId/health
GET /api/crops/:cropId/soil
GET /api/crops/:cropId/weather
GET /api/crops/:cropId/history
GET /api/crops/:cropId/field-map
```

## Data

-   NDVI/EVI
-   Crop health
-   Soil moisture
-   pH
-   Organic carbon
-   Temperature
-   Rainfall
-   Historical trends
-   Field location

## AI connection

Only when interpretation/advisory is needed:

``` text
POST /api/ai/crop-analysis
```

Raw sensor/API data should not be sent blindly to Gemini. Backend should
normalize and validate the data first.

------------------------------------------------------------------------

# 10. CROP DETAILS / FARMING PLAN

## Route

``` text
/crop-details
```

## Backend

``` text
GET /api/crops/:cropId
GET /api/crops/:cropId/calendar
GET /api/crops/:cropId/activities
```

Contains:

-   Crop
-   Sowing date
-   Current stage
-   Health
-   Farming calendar
-   Fertilizer schedule
-   Weed management
-   Disease monitoring

------------------------------------------------------------------------

# 11. FULL CROP GUIDE

## Route

``` text
/full-crop-guide
```

## Backend

``` text
GET /api/crop-guides/:crop
```

Gemini can generate personalized explanations:

``` text
POST /api/ai/crop-guide
```

The final guide should be stored/cached where appropriate instead of
regenerating identical content on every page load.

------------------------------------------------------------------------

# 12. ALTERNATIVE CROP

## Route

``` text
/alternative-crop
```

## Inputs

-   Soil
-   Weather
-   Season
-   Water availability
-   Location
-   Current crop
-   Market
-   Farm size

## Backend

``` text
POST /api/ai/alternative-crop
GET /api/crops/alternatives
```

## Flow

``` text
Farmer Profile
      +
Soil
      +
Weather
      +
Market
      +
Season
      |
      v
Recommendation Engine
      |
      v
Gemini
      |
      v
Alternative Crop
      |
      v
View Farming Plan
      |
      v
Full Crop Guide
```

------------------------------------------------------------------------

# 13. MARKET

## Routes

``` text
/market
```

## Backend

``` text
GET /api/market/prices
GET /api/market/nearby
GET /api/market/trends
GET /api/market/msp
POST /api/market/net-realization
```

## Logic

``` text
Mandi prices
+
Distance
+
Transport cost
+
MSP
+
Historical price
        |
        v
Market calculation
        |
        v
Best Mandi
```

Do not ask Gemini to perform deterministic price/transport calculations.
Backend code should calculate these values.

------------------------------------------------------------------------

# 14. EQUIPMENT

## Equipment list

``` text
/equipment
```

## Backend

``` text
GET /api/equipment
GET /api/equipment/nearby
```

## Equipment detail/rental --- NEW

``` text
/equipment/[equipmentId]
```

Backend:

``` text
GET /api/equipment/:equipmentId
POST /api/equipment/:equipmentId/rent
GET /api/equipment/rentals
POST /api/equipment/rentals/:id/cancel
```

## Rental flow

``` text
Equipment
   |
   v
Select equipment
   |
   v
Date + Time + Duration
   |
   v
Check availability
   |
   v
Calculate cost
   |
   v
Confirm rental
   |
   v
Create rental record in RDS
```

------------------------------------------------------------------------

# 15. INSURANCE

## Farmer route

``` text
/insurance
```

## Backend

``` text
GET /api/insurance/status
GET /api/insurance/eligibility
GET /api/insurance/requirements
POST /api/insurance/applications
GET /api/insurance/applications/:id
```

## Flow

``` text
Farmer
 |
 v
Insurance
 |
 v
Check Eligibility
 |
 v
Documents
 |
 v
Application
 |
 v
Acknowledgement
```

------------------------------------------------------------------------

# 16. GOVERNMENT SCHEMES

## Farmer route

``` text
/schemes
```

## Scheme details

``` text
/schemes/[schemeId]
```

## Backend

``` text
GET /api/schemes
GET /api/schemes/:schemeId
GET /api/schemes/:schemeId/eligibility
POST /api/schemes/:schemeId/apply
```

The eligibility result should be calculated using deterministic backend
rules where possible.

Gemini may explain the scheme in simple language.

------------------------------------------------------------------------

# 17. NOTIFICATIONS

## Routes

``` text
/notifications
/notifications/[id]
```

## Backend

``` text
GET /api/notifications
GET /api/notifications/:id
PATCH /api/notifications/:id/read
```

Notification sources:

``` text
Risk
Weather
Market
Crop Activity
Officer Intervention
Insurance
Government Scheme
```

------------------------------------------------------------------------

# 18. FARMER PROFILE

## Route

``` text
/farmer-profile
```

## Backend

``` text
GET /api/farmer/profile
PATCH /api/farmer/profile
GET /api/farmer/farms
POST /api/farmer/farms
PATCH /api/farmer/farms/:id
```

Profile data:

-   Name
-   Contact
-   Location
-   Language
-   Land
-   Farms
-   Crops
-   KYC status

------------------------------------------------------------------------

# 19. FINANCIAL SUPPORT

## Routes

``` text
/financial-support
/financial-support/detail
/financial-support/acknowledgement
```

## Backend

``` text
GET /api/financial-support
GET /api/financial-support/:id
GET /api/financial-support/:id/eligibility
POST /api/financial-support/:id/apply
GET /api/financial-support/applications/:id
```

------------------------------------------------------------------------

# 20. AGRICULTURE OFFICER DASHBOARD

## Route

``` text
/officer-dashboard
```

## Backend

``` text
GET /api/officer/dashboard
GET /api/officer/risk-summary
GET /api/officer/farmers/high-risk
GET /api/officer/distress-map
GET /api/officer/analytics
```

## Dashboard contains

-   High-risk farmers
-   Medium-risk farmers
-   Low-risk farmers
-   Distress map
-   District statistics
-   Risk analytics
-   Alerts
-   Interventions

------------------------------------------------------------------------

# 21. HIGH-RISK FARMERS

## Route

``` text
/officer-dashboard/farmers
```

## Backend

``` text
GET /api/officer/farmers
GET /api/officer/farmers?risk=high
```

Filters:

-   Risk
-   District
-   Crop
-   Location
-   Increasing risk
-   Insurance status
-   Loan status

------------------------------------------------------------------------

# 22. OFFICER → FARMER DETAILS --- NEW REQUIRED PAGE

## Route

``` text
/officer-dashboard/farmers/[farmerId]
```

## Backend

``` text
GET /api/officer/farmers/:farmerId
GET /api/officer/farmers/:farmerId/risk
GET /api/officer/farmers/:farmerId/crop
GET /api/officer/farmers/:farmerId/interventions
POST /api/officer/farmers/:farmerId/interventions
POST /api/officer/farmers/:farmerId/field-visit
POST /api/officer/farmers/:farmerId/message
```

## Flow

``` text
Officer Dashboard
      |
      v
High-Risk Farmers
      |
      v
Farmer Details
      |
      +--> Risk
      +--> Crop
      +--> Soil
      +--> Weather
      +--> Market
      +--> Financial Risk
      |
      v
Recommended Intervention
      |
      +--> Call Farmer
      +--> Send Message
      +--> Assign Field Visit
      +--> Insurance Support
```

------------------------------------------------------------------------

# 23. GOVERNMENT DASHBOARD --- NEW

## Route

``` text
/government/dashboard
```

## Backend

``` text
GET /api/government/dashboard
GET /api/government/equipment
GET /api/government/rentals
GET /api/government/farmers
GET /api/government/schemes
```

## Sections

``` text
Government Dashboard
 |
 +--> Equipment
 |     +--> Inventory
 |     +--> Availability
 |     +--> Rentals
 |     +--> Maintenance
 |
 +--> Farmers
 |     +--> Registered Farmers
 |     +--> Service Requests
 |
 +--> Schemes
       +--> Scheme Database
       +--> Eligibility Information
```

------------------------------------------------------------------------

# 24. BANK / INSURANCE DASHBOARD --- NEW

## Route

``` text
/bank-insurance/dashboard
```

## Backend

``` text
GET /api/bank-insurance/dashboard
GET /api/bank-insurance/farmers
GET /api/bank-insurance/eligible-farmers
GET /api/bank-insurance/insurance-status
GET /api/bank-insurance/risk-information
POST /api/bank-insurance/farmers/:id/register
```

## Sections

``` text
Bank / Insurance Dashboard
 |
 +--> Farmer Registration
 +--> Eligible Farmers
 +--> Insurance Status
 +--> Crop Risk Information
 +--> Applications
```

------------------------------------------------------------------------

# 25. EXISTING BANK FINANCIAL FACILITY MANAGEMENT

If the bank portal is retained, use:

``` text
/bank-portal/facilities
/bank-portal/facilities/add
```

Backend:

``` text
GET /api/bank/facilities
POST /api/bank/facilities
PATCH /api/bank/facilities/:id
DELETE /api/bank/facilities/:id
```

These routes are protected with bank/admin permissions.

------------------------------------------------------------------------

# 26. DATABASE DESIGN --- AWS RDS POSTGRESQL

Recommended core tables:

``` text
users
roles
user_roles
sessions

farmer_profiles
farms
farm_plots

crops
crop_cycles
crop_activities
crop_guides

soil_measurements
weather_records
market_prices
mandis

crop_health_records
risk_scores
risk_factors
risk_history

ai_recommendations
ai_conversations
ai_messages

notifications

government_schemes
scheme_applications

equipment
equipment_rentals
equipment_maintenance

insurance_products
insurance_applications

financial_facilities
loan_applications

officer_interventions
field_visits

documents
audit_logs
```

------------------------------------------------------------------------

# 27. IMPORTANT DATABASE RELATIONSHIPS

``` text
users
 |
 +---- farmer_profiles
 |          |
 |          +---- farms
 |                 |
 |                 +---- farm_plots
 |                        |
 |                        +---- crop_cycles
 |                               |
 |                               +---- crop_health_records
 |                               +---- soil_measurements
 |                               +---- crop_activities
 |                               +---- risk_scores
 |
 +---- officer_interventions
 |
 +---- notifications
```

Risk relationship:

``` text
crop_cycle
    |
    +--> health
    +--> soil
    +--> weather
    +--> market
    +--> financial
          |
          v
      risk_scores
          |
          v
   ai_recommendations
          |
          v
      farmer actions
```

------------------------------------------------------------------------

# 28. BACKEND API ORGANIZATION

Recommended backend structure:

``` text
backend/
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── gemini.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── farmers/
│   │   ├── farms/
│   │   ├── crops/
│   │   ├── monitoring/
│   │   ├── risk/
│   │   ├── recommendations/
│   │   ├── market/
│   │   ├── equipment/
│   │   ├── insurance/
│   │   ├── schemes/
│   │   ├── financial-support/
│   │   ├── notifications/
│   │   ├── officer/
│   │   ├── government/
│   │   └── bank-insurance/
│   │
│   ├── ai/
│   │   ├── gemini.service.ts
│   │   ├── crop.service.ts
│   │   ├── risk.service.ts
│   │   ├── advisory.service.ts
│   │   └── prompt.service.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── utils/
│   └── server.ts
│
└── package.json
```

------------------------------------------------------------------------

# 29. FRONTEND COMPONENT ORGANIZATION

Do not keep duplicate page-specific folders with inconsistent names such
as:

``` text
Crop Monitoring page/
Crop Details/
Full crop guide/
Alternative crop/
marketpage/
notification page/
farmer profile/
```

Rename them to:

``` text
components/
├── auth/
├── dashboard/
├── crop-monitoring/
├── crop/
├── risk/
├── market/
├── equipment/
├── insurance/
├── schemes/
├── notifications/
├── farmer/
├── officer/
├── government/
├── bank-insurance/
└── shared/
```

Use kebab-case for folders.

------------------------------------------------------------------------

# 30. DUPLICATE ROUTE CLEANUP

The Main Pages document contains aliases for several pages. Keep ONE
canonical route and redirect old routes.

## Farmer Dashboard

Keep:

``` text
/dashboard
```

Redirect/remove:

``` text
/
```

if `/` is not intentionally used as the dashboard.

## Farmer Profile

Keep:

``` text
/farmer-profile
```

Remove/redirect:

``` text
/farmerprofile
```

## Crop Monitoring

Keep:

``` text
/crop-monitoring
```

Remove/redirect:

``` text
/crop-monitoring-page
```

## Market

Keep:

``` text
/market
```

Remove/redirect:

``` text
/marketpage
```

## Notifications

Keep:

``` text
/notifications
/notifications/[id]
```

Remove/redirect:

``` text
/notification-page
```

## Government Schemes

Keep:

``` text
/schemes
/schemes/[schemeId]
```

Old scheme aliases should redirect to `/schemes`.

## Equipment

Keep:

``` text
/equipment
/equipment/[equipmentId]
```

Use `/equipment-dashboard` only if a genuinely separate government/admin
equipment dashboard exists.

------------------------------------------------------------------------

# 31. DUPLICATE FILE/FOLDER CLEANUP RULE

Before deleting anything:

1.  Search the entire project for imports of the file.
2.  Search for route references.
3.  Compare duplicate implementations.
4.  Keep the implementation connected to the canonical route.
5.  Move reusable components into `components/`.
6.  Update imports.
7.  Run TypeScript/build checks.
8.  Only then delete the duplicate.

Never delete a file only because its filename looks duplicated.

------------------------------------------------------------------------

# 32. RENAMING STANDARD

Use:

``` text
kebab-case
```

Examples:

``` text
Crop Monitoring page
        ↓
crop-monitoring

Full crop guide
        ↓
full-crop-guide

Alternative crop
        ↓
alternative-crop

Government equipment schemes
        ↓
government-schemes

Bank Portal
        ↓
bank-insurance
```

React components use PascalCase:

``` text
CropMonitoringPage.tsx
RiskDetailsPage.tsx
AlternativeCropCard.tsx
FarmerRiskTable.tsx
```

------------------------------------------------------------------------

# 33. COMPLETE USER JOURNEY

## Farmer

``` text
Authentication
      ↓
Onboarding
      ↓
Dashboard
      |
      +--> Risk Details
      |       |
      |       +--> Recommended Actions
      |
      +--> Crop Monitoring
      |       |
      |       +--> Weather
      |       +--> Soil
      |       +--> NDVI
      |
      +--> My Crop
      |       |
      |       +--> Crop Details
      |       +--> Farming Calendar
      |       +--> Full Crop Guide
      |
      +--> Alternative Crop
      |       |
      |       +--> Farming Plan
      |
      +--> Market
      |
      +--> More
              |
              +--> Equipment
              +--> Insurance
              +--> Schemes
              +--> Financial Support
              +--> Notifications
              +--> Profile
```

## Officer

``` text
Login
  ↓
Officer Dashboard
  |
  +--> High-Risk Farmers
  |       |
  |       +--> Farmer Details
  |              |
  |              +--> Risk
  |              +--> Crop
  |              +--> Intervention
  |
  +--> Distress Map
  |
  +--> Analytics
  |
  +--> Alerts / Interventions
```

## Government

``` text
Login
  ↓
Government Dashboard
  |
  +--> Equipment
  +--> Rentals
  +--> Farmers
  +--> Schemes
```

## Bank / Insurance

``` text
Login
  ↓
Bank / Insurance Dashboard
  |
  +--> Farmer Registration
  +--> Eligible Farmers
  +--> Insurance Status
  +--> Crop Risk
  +--> Applications
```

------------------------------------------------------------------------

# 34. CORE DISTRESS DETECTION FLOW

This is the central Smart Crop flow.

``` text
Farmer Crop
     |
     +--> Weather
     +--> Soil
     +--> Crop Health
     +--> Market
     +--> Financial
     |
     v
Backend Data Aggregation
     |
     v
Risk Calculation
     |
     v
Risk Score
     |
     v
Risk Details
     |
     v
Gemini AI Explanation
     |
     v
Recommended Actions
     |
     +--------------------+
     |                    |
     v                    v
Farmer Action       Officer Alert
     |                    |
     v                    v
Intervention        Farmer Details
```

------------------------------------------------------------------------

# 35. GEMINI + BACKEND RESPONSIBILITY SPLIT

## Backend must do

-   Authentication
-   Authorization
-   Database operations
-   Validation
-   Risk numerical calculations
-   Market calculations
-   Eligibility rules
-   Availability checks
-   Rental cost calculations
-   Application status
-   Notifications
-   Audit logs
-   API integrations
-   Data normalization

## Gemini should do

-   Natural-language reasoning
-   Explanations
-   Advisory generation
-   Personalized farming suggestions
-   Alternative crop reasoning
-   Disease/pest explanation
-   Conversational AI
-   Multilingual explanations

Do not make Gemini the source of truth for:

``` text
money
balances
prices
eligibility decisions
permissions
authentication
availability
database records
risk numerical calculations
```

------------------------------------------------------------------------

# 36. AI RESPONSE FORMAT

Gemini responses should be requested in structured JSON whenever
possible.

Example:

``` json
{
  "summary": "High water stress detected.",
  "risk_level": "HIGH",
  "reasons": [
    "Low soil moisture",
    "Rainfall below normal",
    "Crop health declining"
  ],
  "actions": [
    {
      "priority": "HIGH",
      "action": "Inspect soil moisture today"
    },
    {
      "priority": "MEDIUM",
      "action": "Review irrigation options"
    }
  ]
}
```

Backend validates the response before saving it.

Never blindly trust model-generated JSON.

------------------------------------------------------------------------

# 37. API SECURITY

Required:

``` text
HTTPS
JWT/session security
Password hashing
Role-based authorization
Input validation
Rate limiting
CORS restrictions
Secure cookies where applicable
Environment variables
Audit logging
SQL parameterization
Request size limits
File upload validation
```

Never expose:

``` text
DATABASE_URL
RDS password
GEMINI_API_KEY
JWT secret
AWS credentials
```

to the browser.

------------------------------------------------------------------------

# 38. ENVIRONMENT VARIABLES

Backend:

``` env
DATABASE_URL=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

GEMINI_API_KEY=

JWT_SECRET=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
```

Frontend should contain only safe public configuration.

------------------------------------------------------------------------

# 39. PAGE PRIORITY

For the SIH prototype, prioritize:

``` text
1. Farmer Dashboard
2. Crop Monitoring
3. Risk Details
4. Recommended Actions
5. Officer Command Center
6. Officer Farmer Details
```

These demonstrate the complete core story:

``` text
Monitor
  ↓
Detect
  ↓
Explain
  ↓
Recommend
  ↓
Intervene
```

------------------------------------------------------------------------

# 40. FINAL REQUIRED PAGE INVENTORY

## Authentication

``` text
/authentication
/onboarding
```

## Farmer

``` text
/dashboard
/risk-details
/recommended-actions
/crop-monitoring
/crop-details
/full-crop-guide
/alternative-crop
/market
/equipment
/equipment/[equipmentId]
/insurance
/schemes
/schemes/[schemeId]
/financial-support
/financial-support/detail
/financial-support/acknowledgement
/notifications
/notifications/[id]
/farmer-profile
```

## Officer

``` text
/officer-dashboard
/officer-dashboard/farmers
/officer-dashboard/farmers/[farmerId]
```

## Government

``` text
/government/dashboard
```

## Bank / Insurance

``` text
/bank-insurance/dashboard
```

## Bank Facility Management

``` text
/bank-portal/facilities
/bank-portal/facilities/add
```

## System

``` text
/unauthorized
```

------------------------------------------------------------------------

# 41. PAGES THAT MUST BE ADDED

These were the major gaps identified when comparing the two supplied MD
files:

``` text
1. /risk-details
2. /recommended-actions
3. /officer-dashboard/farmers
4. /officer-dashboard/farmers/[farmerId]
5. /equipment/[equipmentId]
6. /government/dashboard
7. /bank-insurance/dashboard
```

Some officer functionality already exists as dashboard components in the
original project, so it should be reorganized rather than unnecessarily
duplicated.

------------------------------------------------------------------------

# 42. OLD/UNUSED STRUCTURE TO REMOVE AFTER MIGRATION

Remove duplicate/obsolete implementations after verifying imports:

``` text
Duplicate dashboard implementations
Duplicate crop-monitoring implementations
Duplicate market page implementations
Duplicate notification page implementations
Duplicate farmer-profile implementations
Duplicate government-scheme implementations
Duplicate equipment implementations
Duplicate bank dashboard implementations
```

Do not keep multiple pages containing the same business logic merely
because they use different folder names.

The final application should have:

``` text
ONE canonical page
ONE canonical route
ONE backend API
ONE source of truth
```

Aliases should be redirects, not duplicate implementations.

------------------------------------------------------------------------

# 43. FINAL IMPLEMENTATION RULE

The final project must follow this principle:

``` text
PAGE
 ↓
API
 ↓
SERVICE
 ↓
DATABASE / EXTERNAL API
 ↓
OPTIONAL AI PROCESSING
 ↓
DATABASE
 ↓
PAGE
```

For AI:

``` text
PAGE
 ↓
BACKEND
 ↓
VALIDATED DATA
 ↓
GEMINI
 ↓
VALIDATED AI RESPONSE
 ↓
AWS RDS
 ↓
PAGE
```

For deterministic operations:

``` text
PAGE
 ↓
BACKEND
 ↓
BUSINESS LOGIC
 ↓
AWS RDS
 ↓
PAGE
```

This prevents duplicate logic, protects credentials, keeps AI
centralized, and makes the Smart Crop system easier to maintain and
deploy.
