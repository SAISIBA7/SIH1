# Smart Crop AI – Complete Pages, Endpoints & Interaction Architecture

This document integrates the complete specifications from **`Smart_Crop_Final_Pages_Backend_Architecture.md`** and **`deep-research-report (2).md`**, providing the authoritative end-to-end directory of all pages, live URL routes, interactive UI elements, and REST API endpoints.

---

## 1. Complete REST API Endpoint Specification

| Category | Endpoint | Method | Request Payload (JSON) | Response Schema (JSON) | Connected UI Module |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | `POST` | `{"username", "password"}` | 200: `{"accessToken", "refreshToken", "user": {"id", "role", "fullName"}}` | `/authentication` |
| **Auth** | `/api/auth/register` | `POST` | `{"username", "password", "fullName", "role"}` | 201: `{"message", "userId", "role"}` | `/authentication` |
| **Auth** | `/api/auth/logout` | `POST` | Header: `Bearer <token>` | 200: `{"message": "Logout successful"}` | Header User Dropdown |
| **Agentic AI** | `/api/agentic` | `GET` | `?lat=&lon=&query=` | 200: `{"location": {...}, "reasoning": {"inputs": {...}, "system_recommendations": [...], "llm_reasoning": "..."}, "advisory": "..."}` | `/dashboard`, `/crop-monitoring` |
| **Geo Locate** | `/api/locate` | `GET` | `?lat=&lon=` | 200: `{"state", "district", "block", "season", "coordinates"}` | Farmer Location Input |
| **Crop Filter** | `/api/filter` | `GET` | `?lat=&lon=` | 200: `{"crops": [...], "count"}` | `/alternative-crop` |
| **Loan Apply** | `/api/loans` | `POST` | `{"farmerId", "amount", "purpose"}` | 201: `{"loanId", "status": "pending", "message"}` | `/financial-support/detail` |
| **Loan List** | `/api/loans` | `GET` | `?status=pending` | 200: `[{"loanId", "farmerId", "farmerName", "amount", "purpose", "status"}]` | `/bank-insurance/dashboard` |
| **Loan Detail** | `/api/loans/{id}` | `GET` | — | 200: `{"loanId", "farmerId", "amount", "purpose", "status", "bank"}` | `/financial-support/detail` |
| **Loan Approve** | `/api/loans/{id}/approve` | `POST` | — | 200: `{"loanId", "status": "approved"}` | `/bank-insurance/dashboard` |
| **Loan Reject** | `/api/loans/{id}/reject` | `POST` | — | 200: `{"loanId", "status": "rejected"}` | `/bank-insurance/dashboard` |
| **User List** | `/api/users` | `GET` | `?status=pending` | 200: `[{"id", "username", "fullName", "role", "status"}]` | `/officer-dashboard` |
| **User Detail** | `/api/users/{id}` | `GET` | — | 200: `{"id", "username", "fullName", "phone", "district", "village"}` | `/officer-dashboard/farmers/[id]` |
| **User Approve** | `/api/users/{id}/approve` | `POST` | — | 200: `{"userId", "status": "approved"}` | Admin User Management |
| **User Reject** | `/api/users/{id}/reject` | `POST` | — | 200: `{"userId", "status": "rejected"}` | Admin User Management |

---

## 2. Complete Frontend Routes & Interactive Elements Catalogue

### 2.1 Authentication & Profile Management
- **`/authentication`** — [http://localhost:3000/authentication](http://localhost:3000/authentication)
  - *Clickable Elements*: Role selector tabs (*Farmer*, *Officer*, *Bank*), Sign In / Register toggle, Google OAuth sign-in button, password visibility toggle eye, Forgot Password OTP modal, form submission CTA.
- **`/onboarding`** — [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
  - *Clickable Elements*: Farm profile type cards, landholding area slider, primary crop selector, soil category radio pills, irrigation source buttons, location autocomplete, complete profile CTA.
- **`/unauthorized`** — [http://localhost:3000/unauthorized](http://localhost:3000/unauthorized)
  - *Clickable Elements*: Role permission notice, "Return to Authentication" button.

### 2.2 Farmer Portal & Advisory Journey
- **`/dashboard`** (or `/`) — [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
  - *Clickable Elements*: Floating curved navigation (`Home`, `Risk`, `Advisory`, `Market`, `Schemes`), global search bar, notification bell badge, profile avatar, live location sharing toggle, "View Crop Distress Breakdown" hero button, "Recommended Mitigation Plan" button, radial gauge card, 8 quick-action tiles, AI Agronomist quick prompt chips.
- **`/risk-details`** — [http://localhost:3000/risk-details](http://localhost:3000/risk-details)
  - *Clickable Elements*: "Back to Dashboard" button, "Re-analyze with Gemini AI" live button, risk factor cards (*Weather*, *Soil*, *Market*, *Credit*, *Pest*), "View Recommended Actions" CTA.
- **`/recommended-actions`** — [http://localhost:3000/recommended-actions](http://localhost:3000/recommended-actions)
  - *Clickable Elements*: "Back to Risk Details" button, interactive task completion checkboxes with real-time progress recalculation, individual "Execute in Portal" action links, "Contact Officer & Advisory" CTA.
- **`/crop-monitoring`** — [http://localhost:3000/crop-monitoring](http://localhost:3000/crop-monitoring)
  - *Clickable Elements*: Interactive monthly agronomy calendar, "+ Add Activity" log modal, "Ask AI Agronomist" slide-over drawer with chat input, 3D/7D/14D weather range tabs, soil sensor depth cards, harvest tracker.
- **`/crop-details`** — [http://localhost:3000/crop-details](http://localhost:3000/crop-details)
  - *Clickable Elements*: Lifecycle stage tabs (*Sowing*, *Vegetative*, *Flowering*, *Milking*, *Harvest*), dynamic NPK dosage calculator, pest management accordion, "Download Cultivation Summary" PDF button.
- **`/full-crop-guide`** — [http://localhost:3000/full-crop-guide](http://localhost:3000/full-crop-guide)
  - *Clickable Elements*: Table of contents jump links, multilingual toggle (*English*, *Odia*, *Hindi*), print-friendly formatter.
- **`/alternative-crop`** — [http://localhost:3000/alternative-crop](http://localhost:3000/alternative-crop)
  - *Clickable Elements*: Soil & moisture parameter sliders, "Generate AI Alternative Crops" button, recommendation cards (*Ragi*, *Urad*, *Mustard*), "Adopt Crop Plan" CTA.
- **`/market`** — [http://localhost:3000/market](http://localhost:3000/market)
  - *Clickable Elements*: Mandi distance radius filter (10km–100km), "Compare Mandis" modal, Net Realization Transport Calculator (quantity, vehicle selector, distance slider), market detail breakdown modal, price trend chart timeframe filters (7D/1M/3M/1Y).
- **`/equipment`** — [http://localhost:3000/equipment](http://localhost:3000/equipment)
  - *Clickable Elements*: Category filter pills (*Tractors*, *Harvesters*, *Drones*, *Solar Pumps*), CHC hub location dropdown, "Book Rental" card buttons.
- **`/equipment/[equipmentId]`** — [http://localhost:3000/equipment/EQ-01](http://localhost:3000/equipment/EQ-01)
  - *Clickable Elements*: "Back to Equipment Hub" button, rental duration number input (1–14 days), "Include Certified Operator" checkbox, "Confirm CHC Rental Request" button.
- **`/insurance`** — [http://localhost:3000/insurance](http://localhost:3000/insurance)
  - *Clickable Elements*: PMFBY 3-step registration stepper, "File Instant Crop Loss Claim" button, dry-spell risk context cards, document upload triggers.
- **`/schemes`** — [http://localhost:3000/schemes](http://localhost:3000/schemes)
  - *Clickable Elements*: Multilingual voice search microphone button, category filter tabs, "View Details & Apply" cards, farmer profile match percentage indicator.
- **`/schemes/[schemeId]`** — [http://localhost:3000/schemes/pm-ksy-01](http://localhost:3000/schemes/pm-ksy-01)
  - *Clickable Elements*: Milestone application timeline (*Application*, *Field Verification*, *Sanction*, *DBT Disbursement*), document checklist, "Submit DBT Application" button.
- **`/financial-support`** — [http://localhost:3000/financial-support](http://localhost:3000/financial-support)
  - *Clickable Elements*: Facility type tabs (*KCC Loans*, *Equipment Loans*, *Micro-credit*), interest subvention calculator slider (₹10k–₹3L), "View Details & Apply" buttons.
- **`/financial-support/detail`** — [http://localhost:3000/financial-support/detail](http://localhost:3000/financial-support/detail)
  - *Clickable Elements*: Repayment tenure toggle (12/24/36 months), loan application form, "Submit Loan Application" button.
- **`/financial-support/acknowledgement`** — [http://localhost:3000/financial-support/acknowledgement](http://localhost:3000/financial-support/acknowledgement)
  - *Clickable Elements*: "Download Official Receipt (PDF)" button, "Return to Farmer Dashboard" button.
- **`/notifications`** — [http://localhost:3000/notifications](http://localhost:3000/notifications)
  - *Clickable Elements*: Urgency filter pills (*Critical*, *Warnings*, *Advisory*, *Schemes*), "Mark All as Read" button, notification card navigation.
- **`/notifications/[id]`** — [http://localhost:3000/notifications/1](http://localhost:3000/notifications/1)
  - *Clickable Elements*: "Back to Notifications" link, "Take Action" direct resolution trigger, share via WhatsApp/SMS button.
- **`/farmer-profile`** — [http://localhost:3000/farmer-profile](http://localhost:3000/farmer-profile)
  - *Clickable Elements*: Edit profile information toggle, "+ Add Farm Plot" button, Soil Health Card download link, linked bank mandate switch.

### 2.3 Agriculture Officer & Administrative Portal
- **`/officer-dashboard`** — [http://localhost:3000/officer-dashboard](http://localhost:3000/officer-dashboard)
  - *Clickable Elements*: Officer sidebar drawer navigation (*Command Center*, *High Risk Farmers*, *Distress Map*, *Analytics*, *Alerts*, *Schemes*), mobile hamburger toggle, interactive regional distress map with block markers (*Baripada*, *Betnoti*, *Badasahi*, *Kuliana*), triage table rows with instant detail slide-overs, "Dispatch Direct Intervention" modal button, 30D/90D risk analytics tabs.
- **`/officer-dashboard/farmers`** — [http://localhost:3000/officer-dashboard/farmers](http://localhost:3000/officer-dashboard/farmers)
  - *Clickable Elements*: Live search bar, risk level filter dropdown (*High*, *Medium*, *Low*), "View & Intervene" card buttons.
- **`/officer-dashboard/farmers/[farmerId]`** — [http://localhost:3000/officer-dashboard/farmers/FRM-7821](http://localhost:3000/officer-dashboard/farmers/FRM-7821)
  - *Clickable Elements*: Intervention protocol selector (*Field Visit*, *Tele-Advisory*, *Fast-Track Subsidy*, *Emergency Pest Kit*), target date picker, advisory notes textarea, "Dispatch Intervention Order" submission button.

### 2.4 Government & Institutional Portals
- **`/government/dashboard`** — [http://localhost:3000/government/dashboard](http://localhost:3000/government/dashboard)
  - *Clickable Elements*: CHC machinery inventory cards, utilization rate meters, "Farmer Rental View" and "View All Schemes" buttons.
- **`/bank-insurance/dashboard`** — [http://localhost:3000/bank-insurance/dashboard](http://localhost:3000/bank-insurance/dashboard)
  - *Clickable Elements*: "Add Credit Facility" and "Manage Credit Facilities" buttons, application status filters (*Approved* vs *Pending*), KCC & PMFBY exposure cards.
- **`/bank-portal/facilities`** — [http://localhost:3000/bank-portal/facilities](http://localhost:3000/bank-portal/facilities)
  - *Clickable Elements*: "+ Add New Facility" button, Active/Paused status switches, Edit and Delete facility action icons.
- **`/bank-portal/facilities/add`** — [http://localhost:3000/bank-portal/facilities/add](http://localhost:3000/bank-portal/facilities/add)
  - *Clickable Elements*: Credit product category selector, interest rate and subvention percentage inputs, maximum loan limit field, "Publish Facility" button.
- **`/bank-portal/register`** — [http://localhost:3000/bank-portal/register](http://localhost:3000/bank-portal/register)
  - *Clickable Elements*: Bank name, branch code, and nodal officer designation input fields, "Register Branch" button.
