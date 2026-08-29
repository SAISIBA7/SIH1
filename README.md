# 🌱 SmartCrop — AI-Powered Smart Agriculture & Agri-FinTech Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![AWS RDS](https://img.shields.io/badge/AWS-RDS_MySQL-orange?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/rds/)

**SmartCrop** is an end-to-end intelligent agricultural advisory, climate risk mitigation, credit enablement, and government monitoring platform developed for the **Smart India Hackathon (SIH)**. The platform bridges the gap between **Farmers**, **Agriculture Extension Officers**, **Financial Institutions (Banks/Insurers)**, and **Government Policy Makers**.

---

## 📑 Table of Contents

- [Key Features & User Roles](#-key-features--user-roles)
- [Application Routes & Navigation Directory](#-application-routes--navigation-directory)
- [Backend API Endpoints](#-backend-api-endpoints)
- [Project Architecture & Tech Stack](#-project-architecture--tech-stack)
- [Database Schema (AWS RDS MySQL)](#-database-schema-aws-rds-mysql)
- [Folder & Directory Structure](#-folder--directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables Configuration](#-environment-variables-configuration)

---

## 🎯 Key Features & User Roles

### 🧑‍🌾 1. Farmer Portal
- **Real-Time Dashboard**: Weather observations, soil parameters, active crop lifecycle tracking, and localized alerts.
- **AI-Driven Crop Health & Risk Engine**: Multi-factor risk scoring (pest, weather, soil deficit) with prescriptive mitigation strategies.
- **Alternative Crop Recommendation**: AI recommendation engine suggesting climate-resilient alternative crops tailored to soil and season.
- **Mandi Live Market Rates**: Live commodity pricing and market trends for maximum harvest profitability.
- **Complete Crop Guides & Advisories**: Sowing-to-harvest agronomic best practices and schedules.
- **Farm Equipment Rental Hub**: Peer-to-peer and institutional farm machinery rental marketplace.
- **Financial Support & Insurance**: Direct access to Kisan Credit Cards (KCC), subsidized loans, and crop insurance schemes.

### 🧑‍💼 2. Agriculture Extension Officer Portal
- **Assigned Farmers Directory**: Geo-tagged farmer mapping with real-time risk stratification (High, Moderate, Low).
- **Field Inspection & Assessment**: In-depth inspection reports, verification status, and scheduled farm visits.
- **Intervention Triggers**: Broadcast emergency weather alerts, pest notices, and fast-track subsidy requests.

### 🏦 3. Bank & Insurance Partner Portal
- **Credit & Loan Facility Management**: Create, customize, and publish loan products with interest subvention details.
- **Loan Applications Pipeline**: Review applicant risk profiles, land records, credit scores, and approve/reject loan requests.
- **Integrated Risk & Insurance Dashboard**: Underwriting metrics, active policy tracking, and claim settlements.

### 🏛️ 4. Government & Administrative Console
- **Regional Macro Analytics**: District and state-level crop distribution, yield projections, and stress indices.
- **Scheme Impact Assessment**: Fund disbursement tracking and eligibility verification analytics.

---

## 🗺️ Application Routes & Navigation Directory

### 🌐 Public & Authentication
| Route | URL | Purpose |
| :--- | :--- | :--- |
| **Landing / Home** | `http://localhost:3000/` | Public homepage & quick overview |
| **Authentication** | `http://localhost:3000/authentication` | Sign in & Sign up for all roles |
| **Onboarding** | `http://localhost:3000/onboarding` | Profile & farm onboarding flow |
| **Unauthorized** | `http://localhost:3000/unauthorized` | Access control warning page |

### 🌾 Farmer Domain
| Route | URL | Purpose |
| :--- | :--- | :--- |
| **Dashboard** | `http://localhost:3000/dashboard` | Main Farmer operations console |
| **Farmer Profile** | `http://localhost:3000/farmer-profile` | Personal, land & soil details |
| **Crop Monitoring** | `http://localhost:3000/crop-monitoring` | Live sensor & satellite metrics |
| **Crop Details** | `http://localhost:3000/crop-details` | In-depth stage & agronomy guidance |
| **Alternative Crops** | `http://localhost:3000/alternative-crop` | AI climate-smart crop alternatives |
| **Full Crop Guide** | `http://localhost:3000/full-crop-guide` | Complete farming advisory manual |
| **Risk Analysis** | `http://localhost:3000/risk-details` | Climate, pest, and disease risk factors |
| **Recommended Actions** | `http://localhost:3000/recommended-actions` | Step-by-step mitigation actions |
| **Mandi Market Rates** | `http://localhost:3000/market` | Live commodity mandi prices |
| **Notifications** | `http://localhost:3000/notifications` | Advisory & danger alerts list |
| **Notification Detail** | `http://localhost:3000/notifications/[id]` | Individual alert inspection |

### 💰 Financial, Schemes & Equipment
| Route | URL | Purpose |
| :--- | :--- | :--- |
| **Financial Support** | `http://localhost:3000/financial-support` | Subsidies, credit, and grants list |
| **Support Application** | `http://localhost:3000/financial-support/detail` | Application submission form |
| **Receipt / Acknowledgement** | `http://localhost:3000/financial-support/acknowledgement` | Submission receipt |
| **Government Schemes** | `http://localhost:3000/schemes` | Central & state scheme catalog |
| **Scheme Detail** | `http://localhost:3000/schemes/[schemeId]` | Scheme eligibility & requirements |
| **Crop Insurance** | `http://localhost:3000/insurance` | Insurance claim & policy portal |
| **Equipment Marketplace** | `http://localhost:3000/equipment` | Machinery rental catalog |
| **Equipment Detail** | `http://localhost:3000/equipment/[equipmentId]` | Equipment spec & booking |

### 🧑‍🌾 Agriculture Officer Domain
| Route | URL | Purpose |
| :--- | :--- | :--- |
| **Officer Dashboard** | `http://localhost:3000/officer-dashboard` | Officer command center |
| **Farmers Directory** | `http://localhost:3000/officer-dashboard/farmers` | Assigned farmers list & risk levels |
| **Farmer Inspection** | `http://localhost:3000/officer-dashboard/farmers/[farmerId]` | Farmer diagnostic assessment |
| **Alternative Dashboard** | `http://localhost:3000/agriculture-officer-dashboard` | Secondary officer view |

### 🏦 Bank & Insurance Domain
| Route | URL | Purpose |
| :--- | :--- | :--- |
| **Bank Portal** | `http://localhost:3000/bank-portal` | Bank landing & access point |
| **Bank Dashboard** | `http://localhost:3000/bank-portal/dashboard` | Credit portfolio overview |
| **Facilities Management** | `http://localhost:3000/bank-portal/facilities` | Credit facilities catalog & status toggle |
| **Create Facility** | `http://localhost:3000/bank-portal/facilities/add` | Product creation wizard |
| **Bank Registration** | `http://localhost:3000/bank-portal/register` | New financial institution onboarding |
| **Bank Insurance Dashboard** | `http://localhost:3000/bank-insurance/dashboard` | Underwriting & claims monitor |

### 🏛️ Government & Admin Domain
| Route | URL | Purpose |
| :--- | :--- | :--- |
| **Government Dashboard** | `http://localhost:3000/government/dashboard` | Regional policy & macro analytics |
| **Admin Console** | `http://localhost:3000/admin/dashboard` | System administration & user audit |

---

## ⚡ Backend API Endpoints

### 🔐 Authentication & Users
- `POST /api/auth/login` — Authenticate user and issue session token
- `POST /api/auth/register` — Register a new farmer, officer, or bank user
- `POST /api/auth/logout` — Invalidate user session
- `GET /api/users` — List system users with role filtering
- `GET /api/users/[id]` — Retrieve individual user profile
- `POST /api/users/[id]/approve` — Approve pending user account
- `POST /api/users/[id]/reject` — Reject user registration

### 🌾 Farmer Services
- `GET /api/farmer/dashboard` — Farmer dashboard metrics, weather, and crop status
- `POST /api/farmer/register` — Onboard new farmer profile & land details
- `GET /api/farmer/risk` — Calculate multi-factor risk scores
- `GET /api/farmer/recommendations` — Fetch customized mitigation actions
- `GET /api/profile` — Fetch current logged-in user profile

### 🤖 AI Advisory & Decision Support
- `POST /api/ai/chat` — Conversational agricultural advisory assistant
- `POST /api/ai/risk-explanation` — Natural language risk diagnostic generator
- `POST /api/ai/alternative-crop` — Recommendation engine for alternate crops
- `POST /api/agentic` — Agentic decision workflow orchestrator

### 🧑‍💼 Extension Officer APIs
- `GET /api/officer/dashboard` — Officer jurisdiction statistics & pending tasks
- `GET /api/officer/farmers` — Filtered list of farmers under jurisdiction
- `GET /api/officer/farmers/[farmerId]` — Detailed farmer history & inspection records

### 🏦 Banking & Credit Facilities
- `GET /api/facilities` — List all published financial products
- `POST /api/facilities/create` — Create a new credit facility
- `PATCH /api/facilities/[facilityId]/status` — Toggle status (Draft/Published)
- `GET /api/banks/[bankId]/dashboard` — Bank-specific portfolio analytics
- `GET /api/banks/[bankId]/facilities` — Retrieve facilities created by bank
- `POST /api/banks/register` — Onboard new bank institution

### 🔔 Notifications & Alerts
- `GET /api/notifications` — Retrieve user notifications
- `POST /api/notifications/emit` — Broadcast emergency alert
- `POST /api/notifications/read-all` — Mark notifications as read
- `GET /api/notifications/[id]` — Fetch single notification details

---

## 🛠️ Project Architecture & Tech Stack

```
[ Frontend: Next.js 16 (Turbopack) + React 19 + Tailwind CSS + Framer Motion ]
                                │
                 (HTTP / REST / Dynamic Routes)
                                │
[ Backend API: Next.js Route Handlers + JWT Auth + InsForge BaaS SDK ]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[ AWS RDS MySQL Database ]                    [ AI Model Gateway ]
(Connection Pool / SSL)                     (Risk Diagnosis & Chatbot)
```

- **Framework**: [Next.js 16.3.2](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom Design Tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Database Engine**: [AWS RDS MySQL](https://aws.amazon.com/rds/) via `mysql2/promise` pool
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🗄️ Database Schema (AWS RDS MySQL)

The system utilizes structured relational tables in AWS RDS MySQL (`sih` database):

1. `users` — Authentication credentials, role mapping, account status.
2. `farmer_profiles` / `farmers` — Land acreage, soil classification, irrigation type, KYC status.
3. `crops` — Active crop cycles, sowing date, growth stage, health index.
4. `crop_risk` & `risk_scores` — Multi-dimensional risk ratings (pest, weather, soil).
5. `financial_facilities` — Loan products, subvention percentage, interest rates, tenure.
6. `bank_applications` & `loans` — Loan application tracking and decision history.
7. `banks` & `bank_users` — Financial institution directory & authorized officers.
8. `officer_interventions` — Scheduled field visits, emergency advisories, calls.
9. `notifications` — Role-based broadcast alerts with priority and read receipts.
10. `equipment` & `equipment_rentals` — Farm machinery specs, pricing, and bookings.
11. `mandi_prices` — Regional commodity pricing feeds.

---

## 📁 Folder & Directory Structure

```text
SIH/
├── app/                                # Next.js App Router (Pages & API Routes)
│   ├── admin/dashboard/                # Admin Console Page
│   ├── agriculture-officer-dashboard/  # Secondary Officer View
│   ├── alternative-crop/               # AI Alternate Crop Recommendation Page
│   ├── authentication/                 # Login & Registration Page
│   ├── bank-insurance/dashboard/       # Bank & Insurance Integrated Dashboard
│   ├── bank-portal/                    # Bank Portal, Facilities & Registration
│   ├── crop-details/                   # Crop Analytics Page
│   ├── crop-monitoring/                # Real-Time Monitoring Page
│   ├── dashboard/                      # Main Farmer Dashboard
│   ├── equipment/                      # Equipment Rental Marketplace
│   ├── farmer-profile/                 # Farmer Profile Management
│   ├── financial-support/              # Loan & Grant Applications
│   ├── full-crop-guide/                # Agricultural Manual
│   ├── government/dashboard/           # Policy & Regional Analytics
│   ├── insurance/                      # Crop Insurance Page
│   ├── market/                         # Mandi Market Rates
│   ├── notifications/                  # Alerts & Notification Center
│   ├── officer-dashboard/              # Extension Officer Dashboard & Inspection
│   ├── onboarding/                     # First-Time User Onboarding
│   ├── recommended-actions/            # Actionable Advisory Steps
│   ├── risk-details/                   # Climate & Pest Risk Breakdown
│   ├── schemes/                        # Government Schemes Catalog
│   ├── unauthorized/                   # Access Control Error View
│   ├── api/                            # Backend REST Route Handlers
│   │   ├── ai/                         # AI Chat & Advisory Endpoints
│   │   ├── auth/                       # Authentication Endpoints
│   │   ├── banks/                      # Bank & Credit APIs
│   │   ├── facilities/                 # Financial Facilities APIs
│   │   ├── farmer/                     # Farmer Services APIs
│   │   ├── government/                 # Government Analytics APIs
│   │   ├── notifications/              # Alerts Engine APIs
│   │   ├── officer/                    # Officer Assessment APIs
│   │   └── users/                      # User Management APIs
│   ├── layout.tsx                      # Root Application Layout
│   └── page.tsx                        # Home / Landing Page
│
├── Bank Portal/                        # Bank UI Components & Modular Views
├── components/                         # Reusable UI & Domain Components
│   ├── admin/                          # Admin Dashboard Components
│   ├── bank-insurance/                 # Bank & Insurance Widgets
│   ├── dashboard/                      # Farmer Widgets & Charts
│   ├── farmer/                         # Farmer Management Components
│   ├── officer/                        # Officer Inspection Views
│   └── risk/                           # Risk Gauges & Breakdown Panels
├── farmer deshboard/                   # Core Farmer Dashboard Visuals
├── lib/                                # Utilities & Database Connection
│   ├── db.ts                           # AWS RDS MySQL Connection Pool
│   └── smartcrop-auth.ts               # Auth & Role Utilities
├── scripts/                            # Database Seed & Migration Scripts
├── public/                             # Static Assets, Icons & Images
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
Create a `.env.local` file in the root directory and populate your credentials (see template below).

### 3. Run Development Server
```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Environment Variables Configuration

Create a `.env.local` file in the root directory:

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

# Optional / External BaaS Gateway
NEXT_PUBLIC_INSFORGE_PROJECT_URL=https://856k6wi6.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your_anon_key
```

---

## 👥 Contributors & Acknowledgements

Developed with ❤️ for the **Smart India Hackathon (SIH)**.
