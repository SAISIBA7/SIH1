You are a senior frontend engineer and UI/UX designer.

Build ONLY the frontend for the **Agriculture Officer Dashboard** of the Smart Crop — Agricultural Distress Early Warning Platform.

I will provide:
1. Product Requirement Documents (PRDs)
2. UI structure document
3. A reference image that defines the complete visual theme, background, card style, colors, spacing, and overall design language.

Your task is to create a production-quality frontend that follows the provided theme exactly.

## Product Context

This is an Agriculture Officer Command Center.

The officer does not manage one farmer. The officer monitors hundreds/thousands of farmers and needs to:

- Identify farmers entering distress
- Understand why they are at risk
- Prioritize intervention
- View district-level agricultural risk
- Contact farmers and assign actions

The dashboard should communicate:

MONITOR → DETECT → EXPLAIN → INTERVENE → PREVENT

Do NOT design this like a generic admin dashboard.
It should feel like an intelligent agricultural command center.

---

# Design Requirements

## Theme Implementation

Use the provided reference image as the primary design inspiration.

Match:

- Background style
- Gradient usage
- Glassmorphism/card effects if present
- Border radius
- Shadows
- Typography hierarchy
- Spacing system
- Card layouts
- Icon style
- Color palette
- Overall premium futuristic agriculture feel

The login/landing transition should maintain the same visual identity.

When an Agriculture Officer logs in, they should first see the themed dashboard environment.

---

# Dashboard Layout

Create a responsive desktop-first dashboard.

## Main Layout

Left Sidebar:

Include:

- Smart Crop logo
- Command Center
- High Risk Farmers
- Distress Map
- Analytics
- Alerts
- Farmer Database
- Intervention History
- Settings

Sidebar should follow the provided theme.

---

# Main Dashboard Screen

Create:

## Header

Show:

Agricultural Distress Command Center

Example:

"Mayurbhanj District"

Include:

- Officer profile
- Notifications
- Search
- Current district selector

---

# Top Statistics Cards

Create beautiful interactive cards:

## High Risk Farmers

Example:

17 Farmers

Red danger indicator

## Medium Risk Farmers

34 Farmers

Yellow warning indicator

## Low Risk Farmers

128 Farmers

Green status indicator

## Total Farmers Monitored

1,248 Farmers

Cards should have:

- Icons
- Trend indicators
- Smooth hover animations
- Modern visual hierarchy

---

# Priority Farmers Section

Create a large card/table.

Title:

"Priority Farmers"

Columns:

Farmer Name

Crop

Risk Score

Location

Risk Reason

Loan Status

Action


Example data:

Ramesh
Paddy
81/100
Mayurbhanj
Rainfall ↓35%
Loan due in 8 days


Each farmer row should have:

- Risk badge
- Crop badge
- Action button


Actions:

- View Details
- Call Farmer
- Send SMS
- Assign Visit

---

# Distress Map Section

Create a visual map component.

Purpose:

Show agricultural distress concentration.

Features:

- District map placeholder
- Red/yellow/green markers
- Farmer clusters
- Risk zones

The map should look like a command center visualization.

---

# Analytics Section

Create charts:

## Risk Trend

Example:

60 → 67 → 72 → 81

Line chart

## District Risk Distribution

Pie/bar visualization

## Crop Risk Breakdown

Example:

Paddy:
High Risk

Maize:
Medium Risk

Groundnut:
Low Risk


Use:

Recharts

---

# Farmer Detail View

Create a detailed page/modal.

When officer clicks a farmer:

Show:

## Farmer Profile

Name

Village

District

Land Area

Current Crop

Sowing Date


## Risk Score

Large display:

81/100

HIGH RISK


## Risk Breakdown


Weather Risk

32/40


Market Risk

29/40


Financial Risk

20/20


## Reasons

Display:

- Rainfall 35% below normal
- Soil moisture critically low
- Paddy price decreased 22%
- Loan due in 8 days


## Recommended Intervention


Cards:

Field Inspection

Insurance Registration

Alternative Crop Assessment


Buttons:

CALL FARMER

SEND SMS

ASSIGN FIELD VISIT

---

# Alerts Panel

Create real-time alert style cards:

Examples:

"17 farmers crossed high-risk threshold"

"Heavy rainfall expected tomorrow"

"Paddy prices decreased in nearby mandis"


---

# UX Requirements

The dashboard should feel:

- Data-driven
- AI-powered
- Government technology platform
- Reliable
- Simple enough for field officers

Avoid:

- Generic SaaS dashboards
- Too many tables
- Corporate CRM appearance

Prefer:

- Visual storytelling
- Large information cards
- Risk visualization
- Map-based understanding
- Clear intervention actions

---

# Technical Requirements

Frontend only.

Use:

Framework:
Next.js 14+ App Router

Language:
TypeScript

Styling:
Tailwind CSS

Components:
Reusable React components

Charts:
Recharts

Icons:
Lucide React

State:
Zustand if required

Use mock JSON data.

No backend implementation.

---

# Components Required

Create:

- Sidebar
- Header
- RiskSummaryCards
- FarmerRiskTable
- DistressMap
- RiskAnalyticsCharts
- FarmerDetailPanel
- AlertPanel
- InterventionModal

---

# Animation Requirements

Add subtle animations:

- Card hover
- Number counters
- Chart loading
- Sidebar transitions
- Modal transitions

Use Framer Motion.

---

# Important

The final output should look like a hackathon-winning prototype.

The first impression should be:

"This is an AI-powered agricultural emergency command center."

Maintain consistency with the provided background reference image throughout the application.