# 🌱 SmartCrop — AI-Powered Smart Agriculture & Agri-FinTech Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![AWS RDS](https://img.shields.io/badge/AWS-RDS_MySQL-orange?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/rds/)
[![Sarvam AI](https://img.shields.io/badge/Sarvam_AI-Indic_NLP-purple?style=flat-square)](https://www.sarvam.ai/)
[![Multilingual](https://img.shields.io/badge/Languages-22+_Indic_Languages-emerald?style=flat-square)](https://translate.google.com/)

**SmartCrop** is an enterprise-grade agricultural intelligence, climate distress prediction, farm credit facilitation, and government monitoring platform built for the **Smart India Hackathon (SIH)**. The ecosystem seamlessly integrates four critical stakeholder domains: **Smallholder Farmers**, **Agriculture Extension Officers / Administrators**, **Institutional Banks / Insurers**, and **Government Policy Makers**.

---

## 📑 Table of Contents

- [Core Stakeholder Portals](#-core-stakeholder-portals)
- [Multilingual & Real-Time Translation System](#-multilingual--real-time-translation-system)
- [Security, Middleware & Authentication Architecture](#-security-middleware--authentication-architecture)
- [Application Routes & Navigation Directory](#-application-routes--navigation-directory)
- [Backend REST API Endpoints](#-backend-rest-api-endpoints)
- [System Architecture & Technology Stack](#-system-architecture--technology-stack)
- [Database Schema (AWS RDS MySQL)](#-database-schema-aws-rds-mysql)
- [Folder & Directory Structure](#-folder--directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Verification & Quality Assurance](#-verification--quality-assurance)

---

## 🎯 Core Stakeholder Portals

### 🧑‍🌾 1. Farmer Portal
- **Real-Time Farm Dashboard**: Live weather observation, soil moisture/temperature telemetry, active crop lifecycle tracking, and localized danger alerts.
- **AI Crop Health & Distress Engine**: Multi-factor risk scoring (pest attacks, drought, excessive precipitation, soil nutrient deficits) with prescriptive remedies.
- **Crop Monitoring & Phenology Calendar**: Stage-by-stage crop calendar, irrigation schedule optimization, and daily agronomy tasks.
- **Climate-Resilient Alternative Crops**: AI recommendation engine suggesting optimal alternative crops based on soil chemistry and regional monsoon forecasts.
- **Live Mandi Rates**: Real-time APMC commodity price feeds and historical trend charts across Odisha and nationwide markets.
- **Custom Hiring Center (CHC) Equipment Hub**: Tractors, Harvesters, Power Tillers, and Spraying Drones available for hourly/daily rental with instant booking.
- **Financial Facilities & KCC Loans**: Direct discovery, interest subvention calculation, and 1-click loan applications.
- **PMFBY Crop Insurance**: Policy matching, premium estimation, and insurance claim tracking.
- **Farmer Profile Management**: Land parcel records, soil health parameters, and one-click Sign Out.

### 🧑‍💼 2. Agriculture Extension Officer & Administrator Portal
- **Agricultural Distress Command Center**: District distress heatmaps and high-stress farmer triage.
- **Assigned Farmers Directory**: Geo-tagged farmer mapping with real-time risk stratification (High, Moderate, Low).
- **Field Inspection & Interventions**: Schedule on-site farm visits, log diagnostic reports, trigger emergency advisories, and fast-track relief funds.

### 🏦 3. Bank & Financial Partner Portal
- **Credit & Loan Facility Management**: Create, customize, publish, draft, or suspend agricultural loan products with interest subvention details.
- **Loan Applications Pipeline**: Review applicant risk profiles, land records, creditworthiness scores, and approve/reject loan requests.
- **Institutional Risk & Insurance Dashboard**: Underwriting metrics, active policy tracking, and PMFBY claim adjudication.

### 🏛️ 4. Government & CHC Administration Console
- **Regional Macro Analytics**: District and state-level crop distribution, yield projections, and stress indices.
- **CHC Equipment Allocation**: Public machinery pool management and custom hiring center dispatching.
- **Scheme Impact Assessment**: Direct Benefit Transfer (DBT) fund disbursement tracking and subsidy delivery auditing.

---

## 🌐 Multilingual & Real-Time Translation System

SmartCrop features a hybrid, low-latency multilingual engine designed for rural accessibility across all 22+ Scheduled Indian Languages:

### 1. Dual-Layer Translation Architecture
- **Layer 1: Instant Client UI Dictionary**: Pre-compiled translation dictionary (`UI_DICTIONARY` in [`lib/language-context.tsx`](lib/language-context.tsx)) for zero-latency instant rendering of navigational elements, labels, buttons, and headings.
- **Layer 2: Real-Time Full-DOM Google Translate Engine**: Automatic full-page DOM translation powered by Google Translate runtime scripts in [`app/layout.tsx`](app/layout.tsx), translating dynamic text, cards, tables, modals, and descriptions in real time.
- **Layer 3: Indic Neural NLP (Sarvam AI)**: Server-side machine translation (`/api/translate`) and natural Text-to-Speech voice synthesis (`/api/sarvam`) for conversational AI agronomist advisory.

### 2. Supported Languages (22+ Indian Languages + English)
| Code | Language | Native Name | Code | Language | Native Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `en` | English | English | `hi` | Hindi | हिन्दी |
| `or` | Odia | ଓଡ଼ିଆ | `bn` | Bengali | বাংলা |
| `te` | Telugu | తెలుగు | `ta` | Tamil | தமிழ் |
| `mr` | Marathi | मराठी | `gu` | Gujarati | ગુજરાતી |
| `pa` | Punjabi | ਪੰਜਾਬੀ | `kn` | Kannada | ಕನ್ನಡ |
| `ml` | Malayalam | മലയാളം | `as` | Assamese | অসমীয়া |
| `ur` | Urdu | اردو | `ne` | Nepali | नेपाली |
| `sa` | Sanskrit | संस्कृतम् | `mai`| Maithili | मैथिली |
| `sd` | Sindhi | सिन्धी / سنڌي | `ks` | Kashmiri | कॉशुर / کٲشُر |
| `kok`| Konkani | कोंकणी | `mni`| Manipuri | ꯃꯤꯇꯩꯂꯣꯟ |
| `brx`| Bodo | बर' | `doi`| Dogri | डोगरी |
| `sat`| Santali | ᱥᱟᱱᱛᱟᱲᱤ | — | — | — |

### 3. Persistent Global Switcher & Cross-Page State
- **Global Floating Switcher**: Accessible from any page via `<LanguageSelector variant="floating" />` pinned at the bottom-right corner.
- **In-Navbar Switchers**: Inlined glassmorphic dropdowns in Farmer, Officer, and Bank headers.
- **Cross-Route Persistence**: Active language choice is saved in `localStorage` and `googtrans` cookies, automatically applying when navigating between **Farmer**, **Administrator**, **Bank**, and **Government** portals.

---

## 🛡️ Security, Middleware & Authentication Architecture

### 1. Role-Based Access Control (RBAC) & Next.js Proxy Middleware
Protected routes are strictly enforced via the root Next.js proxy middleware ([`proxy.ts`](proxy.ts)) compatible with Next.js 16.3.2 Turbopack:

| Path Prefix | Minimum Required Role | Unauthenticated Behavior | Unauthorized Role Behavior |
| :--- | :--- | :--- | :--- |
| `/dashboard`, `/farmer-profile`, `/crop-*`, `/risk-details` | `farmer` or `administrator` | Redirect to `/authentication?redirectUrl=...` | Redirect to `/unauthorized` |
| `/admin/*`, `/officer-dashboard/*`, `/government/*` | `administrator` / `admin` | Redirect to `/authentication?redirectUrl=...` | Redirect to `/unauthorized` |
| `/bank/*`, `/bank-portal/*`, `/bank-insurance/*` | `bank` or `administrator` | Redirect to `/authentication?redirectUrl=...` | Redirect to `/unauthorized` |
| `/api/officer/*`, `/api/government/*` | `administrator` | HTTP `401 Unauthorized` | HTTP `403 Forbidden` |
| `/api/banks/*`, `/api/facilities/create` | `bank` or `administrator` | HTTP `401 Unauthorized` | HTTP `403 Forbidden` |

### 2. Dual Cookie & JWT Session Management
- **Token Handling**: Standard signed JSON Web Tokens (`smartcrop_token`) and persistent state cookies (`smartcrop_session`) set with `SameSite=Lax` and `HttpOnly` security flags.
- **Centralized Sign Out**: All profile headers, navigation sidebars, and dashboard action bars feature an instant **Logout / Sign Out** button that calls `smartCropAuth.signOut()` to clear client state, destroy session cookies, and route the user back to `/authentication`.

---

## 🗺️ Application Routes & Navigation Directory

### 🌐 1. Public & Discovery Pages
| Route | URL Link | Description |
| :--- | :--- | :--- |
| **Landing / Home** | `http://localhost:3000/` | Interactive product overview & ecosystem entry (redirects to `/dashboard`) |
| **Authentication** | `http://localhost:3000/authentication` | Unified Sign In & Registration with role selection |
| **Farmer Onboarding** | `http://localhost:3000/onboarding` | Step-by-step land parcel, soil, and crop onboarding |
| **Mandi Market Rates** | `http://localhost:3000/market` | Live APMC mandi commodity prices & trend charts |
| **Government Schemes** | `http://localhost:3000/schemes` | Central & State agricultural subsidy directory |
| **Scheme Detail** | `http://localhost:3000/schemes/pm-kisan` | Dynamic subsidy milestone checklist & eligibility |
| **Full Crop Guide** | `http://localhost:3000/full-crop-guide` | Complete agronomic sowing-to-harvest cultivation guide |
| **Alternative Crops** | `http://localhost:3000/alternative-crop` | AI climate-resilient alternative crop suggestions |
| **AI Agronomist Chat** | `http://localhost:3000/ai-chat` | Voice & text AI assistant in Indic languages |
| **Unauthorized View** | `http://localhost:3000/unauthorized` | Security barrier for insufficient permissions |

### 🌾 2. Farmer Portal *(Requires `farmer` or `administrator`)*
| Route | URL Link | Description |
| :--- | :--- | :--- |
| **Farmer Dashboard** | `http://localhost:3000/dashboard` | Main telemetry, farm health index & danger alerts |
| **Farmer Profile** | `http://localhost:3000/farmer-profile` | Personal details, plot boundaries, and Logout |
| **Crop Monitoring** | `http://localhost:3000/crop-monitoring` | Satellite NDVI, soil metrics & interactive calendar |
| **Crop Details** | `http://localhost:3000/crop-details` | Stage timeline, irrigation needs & pest protocols |
| **Risk Diagnostics** | `http://localhost:3000/risk-details` | Pest, weather & soil moisture distress scores |
| **Recommended Actions** | `http://localhost:3000/recommended-actions` | Priority prescriptive advisory interventions |
| **Equipment Marketplace**| `http://localhost:3000/equipment` | CHC Machinery rental catalog & booking engine |
| **Financial Support** | `http://localhost:3000/financial-support` | KCC crop loans & low-interest credit schemes |
| **Support Application** | `http://localhost:3000/financial-support/detail` | Credit application & subvention calculator |
| **Application Receipt** | `http://localhost:3000/financial-support/acknowledgement` | Submission confirmation & tracking token |
| **Crop Insurance** | `http://localhost:3000/insurance` | PMFBY policy matching, claims & premium calculator |
| **Notifications** | `http://localhost:3000/notifications` | Real-time weather warnings & credit alerts |

### 🧑‍💼 3. Agriculture Officer & Administrator Portal *(Requires `administrator`)*
| Route | URL Link | Description |
| :--- | :--- | :--- |
| **Admin Route Connector**| `http://localhost:3000/admin` | Quick redirect to active administrator dashboard |
| **Admin Command Center**| `http://localhost:3000/admin/dashboard` | District distress heatmap & high-risk triage |
| **Officer Dashboard** | `http://localhost:3000/agriculture-officer-dashboard` | Field officer workspace & advisory broadcaster |
| **District Overview** | `http://localhost:3000/officer-dashboard` | Block-wise monitoring across Mayurbhanj |
| **High-Risk Directory** | `http://localhost:3000/officer-dashboard/farmers` | Distress scores, crop status & intervention tools |
| **Government Route** | `http://localhost:3000/government` | Quick redirect to government administration hub |
| **Government CHC Hub** | `http://localhost:3000/government/dashboard` | State machinery allocation & DBT subsidy stats |

### 🏦 4. Bank Partner Portal *(Requires `bank` or `administrator`)*
| Route | URL Link | Description |
| :--- | :--- | :--- |
| **Bank Route Connector** | `http://localhost:3000/bank` | Quick redirect to bank dashboard |
| **Bank Portal** | `http://localhost:3000/bank-portal` | Bank partner landing & quick actions |
| **Bank Dashboard** | `http://localhost:3000/bank-portal/dashboard` | Credit portfolio overview & verification badge |
| **Credit Facilities** | `http://localhost:3000/bank-portal/facilities` | Manage, publish, draft or suspend credit schemes |
| **Create Facility** | `http://localhost:3000/bank-portal/facilities/add` | New credit facility creation wizard |
| **Bank Registration** | `http://localhost:3000/bank-portal/register` | Financial institution verification & onboarding |
| **Bank Underwriting** | `http://localhost:3000/bank-insurance/dashboard` | Credit risk scoring & PMFBY insurance claims |

---

## ⚡ Backend REST API Endpoints

### 🔐 Authentication & Session
- `POST /api/auth/login` — Authenticate user (Email/Phone + Password) with signed JWT and cookies
- `POST /api/auth/register` — Register a new Farmer, Officer, or Bank user
- `POST /api/auth/logout` — Invalidate user session and clear browser cookies
- `GET /api/profile` — Fetch current authenticated user profile & farm holdings
- `GET /api/db-check` — Real-time AWS RDS MySQL health test

### 🌾 Farmer & Agronomy
- `GET /api/farmer/dashboard` — Aggregated telemetry, weather forecast & distress score
- `POST /api/farmer/register` — Onboard new farmer profile & land details
- `GET /api/farmer/risk` — Multi-factor distress risk score breakdown
- `GET /api/farmer/recommendations` — Prescriptive mitigation action items
- `GET /api/equipment` — Custom Hiring Center (CHC) equipment inventory
- `POST /api/equipment/[id]/book` — Book machinery rental slot

### 🤖 AI Advisory & Indic NLP (Sarvam AI & Google Translate)
- `POST /api/ai/chat` — Conversational multilingual agricultural assistant
- `POST /api/ai/risk-explanation` — Natural language risk diagnostic generator
- `POST /api/ai/alternative-crop` — Recommendation engine for alternate crops
- `POST /api/translate` — Indic text translation across 22 scheduled Indian languages
- `POST /api/sarvam` — Sarvam AI translation & Text-to-Speech (TTS) voice generation

### 🧑‍💼 Extension Officer APIs
- `GET /api/officer/dashboard` — Jurisdiction statistics & pending field tasks
- `GET /api/officer/farmers` — Filtered list of monitored farmers under jurisdiction
- `GET /api/officer/farmers/[farmerId]` — Detailed farmer history & inspection records

### 🏦 Banking & Credit Facilities
- `GET /api/facilities` — List all active and published financial facilities
- `POST /api/facilities/create` — Create a new credit facility
- `PATCH /api/facilities/[facilityId]/status` — Toggle facility lifecycle status
- `GET /api/banks/[bankId]/dashboard` — Bank-specific portfolio analytics
- `GET /api/banks/[bankId]/facilities` — Retrieve facilities created by a bank

### 🔔 Notifications & Alerts
- `GET /api/notifications` — Retrieve user notifications
- `POST /api/notifications/emit` — Broadcast emergency weather/distress alert
- `POST /api/notifications/read-all` — Mark all notifications as read

---

## 🛠️ System Architecture & Technology Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│               Frontend: Next.js 16 (Turbopack) + React 19              │
│       Tailwind CSS v4 • Framer Motion • Lucide Icons • Recharts        │
│       Global Floating Language Switcher • Realtime Translation Engine  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         (Next.js Proxy Middleware)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Backend API Route Handlers (Edge & Node.js Runtime)        │
│              JWT Auth • RBAC • Dual Cookies • Input Validation         │
└───────────────┬───────────────────┬────────────────────┬───────────────┘
                │                   │                    │
                ▼                   ▼                    ▼
┌───────────────────────┐ ┌───────────────────┐ ┌────────────────────────┐
│  AWS RDS MySQL Pool   │ │   Sarvam AI API   │ │   Google Translate     │
│  (Connection Manager) │ │ (Indic NLP & TTS) │ │ (Full-DOM Translation) │
└───────────────────────┘ └───────────────────┘ └────────────────────────┘
```

- **Framework**: [Next.js 16.3.2](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Motion & Micro-interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Database Engine**: [AWS RDS MySQL](https://aws.amazon.com/rds/) via singleton connection pool (`mysql2/promise`)
- **Indic NLP Gateway**: [Sarvam AI](https://www.sarvam.ai/) REST API
- **Translation Runtime**: Google Translate API + Custom React Localization Context
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & React Context

---

## 🗄️ Database Schema (AWS RDS MySQL)

The system utilizes structured relational tables in AWS RDS MySQL (`sih` database):

1. **`users`**: Authentication credentials, role mapping (`farmer`, `administrator`, `bank`), account status.
2. **`farmer_profiles` / `farmers`**: Land acreage, soil classification, irrigation type, KYC status, contact info.
3. **`crops`**: Active crop cycles, sowing date, growth stage, health index, yield forecast.
4. **`crop_risk` & `risk_scores`**: Multi-dimensional risk ratings (pest, weather, soil moisture).
5. **`financial_facilities`**: Loan products, subvention percentage, interest rates, tenure, collateral limits.
6. **`bank_applications` & `loans`**: Loan application tracking and adjudication history.
7. **`banks` & `bank_users`**: Financial institution directory & authorized credit officers.
8. **`officer_interventions`**: Scheduled field visits, emergency advisories, calls.
9. **`notifications`**: Role-based broadcast alerts with priority and read receipts.
10. **`equipment` & `equipment_rentals`**: Farm machinery specs, hourly pricing, and bookings.
11. **`mandi_prices`**: Regional APMC commodity pricing feeds.

---

## 📁 Folder & Directory Structure

```text
SIH/
├── app/                                # Next.js App Router (Pages & API Handlers)
│   ├── admin/                          # Admin Routes (/admin & /admin/dashboard)
│   ├── agriculture-officer-dashboard/  # Officer Dashboard View
│   ├── alternative-crop/               # AI Alternate Crop Recommendation Page
│   ├── authentication/                 # Login & Registration Portal
│   ├── bank/                           # Bank Route Connector (/bank & /bank/dashboard)
│   ├── bank-insurance/dashboard/       # Bank & Insurance Console
│   ├── bank-portal/                    # Bank Portal, Facilities & Registration
│   ├── crop-details/                   # Crop Analytics & Calendar Page
│   ├── crop-monitoring/                # Real-Time Sensor & Satellite Monitoring
│   ├── dashboard/                      # Main Farmer Dashboard
│   ├── equipment/                      # Equipment Rental Marketplace
│   ├── farmer-profile/                 # Farmer Profile Management
│   ├── financial-support/              # Loan & Grant Applications
│   ├── full-crop-guide/                # Agricultural Manual
│   ├── government/                     # Government Routes (/government & /government/dashboard)
│   ├── insurance/                      # Crop Insurance Portal
│   ├── market/                         # Mandi Market Rates
│   ├── notifications/                  # Alerts & Notification Center
│   ├── officer-dashboard/              # Extension Officer Dashboard & Inspection
│   ├── onboarding/                     # First-Time User Onboarding
│   ├── recommended-actions/            # Actionable Advisory Steps
│   ├── risk-details/                   # Climate & Pest Risk Breakdown
│   ├── schemes/                        # Government Schemes Hub & Dynamic Details
│   ├── unauthorized/                   # Security Access Control Warning View
│   ├── api/                            # Backend REST Route Handlers
│   ├── layout.tsx                      # Root Application Layout (Google Translate & Global Switcher)
│   └── page.tsx                        # Home / Landing Page
│
├── Bank Portal/                        # Bank UI Components & Modular Views
├── components/                         # Reusable UI & Domain Components
│   ├── admin/                          # Admin Dashboard Components
│   ├── bank-insurance/                 # Bank & Insurance Widgets
│   ├── dashboard/                      # Farmer Widgets & Charts
│   ├── farmer/                         # Farmer Management Components
│   ├── government/                     # Government Hub Components
│   ├── officer/                        # Officer Inspection Views
│   ├── LanguageSelector.tsx            # Global Floating & Inlined Language Selector
│   └── TopLanguageBar.tsx              # Top Language Bar Component
├── farmer deshboard/                   # Core Farmer Dashboard Visuals & Navbar
├── farmer profile/                     # Farmer Profile Views & Task Manager
├── Crop Details/                       # Crop Calendar & Health Metrics
├── lib/                                # Utilities & Database Connection
│   ├── db.ts                           # AWS RDS MySQL Connection Pool (Singleton)
│   ├── smartcrop-auth.ts               # Client Auth & Role Utilities
│   ├── sarvam-ai.ts                    # Sarvam AI REST Client (Translation & TTS)
│   └── language-context.tsx            # Multilingual Localization Engine & Route Sync
├── scripts/                            # Verification & Diagnostic Test Scripts
├── public/                             # Static Assets, Icons & Images
├── proxy.ts                            # Next.js 16 Security & RBAC Middleware
├── package.json                        # Dependencies & Project Scripts
├── next.config.ts                      # Next.js Build Configuration
└── README.md                           # Comprehensive Documentation
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) version **20.x** or higher
- [npm](https://www.npmjs.com/) version **10.x** or higher

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd SIH
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and populate your credentials:

```env
# AWS RDS MySQL Database Configuration
DB_HOST=sih-mysql.cley86o8g8vx.eu-north-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_rds_password
DB_NAME=sih

# Authentication & Secret Keys
JWT_SECRET=your_jwt_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sarvam AI Indic NLP Gateway
SARVAM_API_KEY=your_sarvam_api_key

# Optional / External BaaS Gateway
NEXT_PUBLIC_INSFORGE_PROJECT_URL=https://856k6wi6.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Quality Assurance

Run the test and build verification suite:

```bash
# Verify TypeScript Types (0 errors)
npx tsc --noEmit

# Verify Production Build
npm run build
```

---

## 👥 Contributors & Acknowledgements

Developed with ❤️ for the **Smart India Hackathon (SIH)**.
