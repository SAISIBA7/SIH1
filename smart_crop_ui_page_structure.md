# Smart Crop — UI / Page Structure

## Core UI Philosophy

Since **crop monitoring and distress detection are the core**, the UI should be designed around the farmer's current crop condition and risk.

The other features should appear primarily as **interventions and support mechanisms**, rather than as unrelated modules.

The main dashboard should answer four questions:

> **How is my crop?**  
> **Why is it at risk?**  
> **What should I do today?**  
> **What support/options do I have?**

---

# Overall Website Structure

There are three major dashboards:

1. 👨‍🌾 **Farmer Dashboard** — main product
2. 🧑‍🌾 **Agriculture Officer Dashboard** — distress monitoring/intervention
3. 🏛️🏦 **Government / Bank / Insurance Dashboard** — equipment, insurance, registrations

---

# 1. 👨‍🌾 Farmer Dashboard — Main Dashboard

This is the first page after the farmer logs in.

```text
┌─────────────────────────────────────────────────────┐
│ 🌾 SMART CROP                         🔔   👤       │
│                                                     │
│ Good morning, Ramesh                                │
│ Mayurbhanj • Paddy • 2.5 acres                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🚨 YOUR CROP DISTRESS STATUS                        │
│                                                     │
│                 81 / 100 🔴                         │
│                  HIGH RISK                           │
│                                                     │
│  🌧️ Rainfall       ↓ 35%                            │
│  💧 Soil Moisture  LOW                               │
│  🌱 Crop Health    ↓ 18%                            │
│  💰 Market Price   ↓ 22%                            │
│                                                     │
│             [WHY IS MY RISK HIGH?]                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ⚠️ WHAT NEEDS YOUR ATTENTION?                       │
│                                                     │
│ 🔴 Check soil moisture                              │
│ 🟡 Heavy rain expected tomorrow                     │
│ 🟡 Market price declining                           │
│                                                     │
│                 [VIEW ALL]                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📅 TODAY'S FARMING ACTIVITY                         │
│                                                     │
│ • Field inspection due                              │
│ • Weed monitoring                                   │
│                                                     │
│              [VIEW CROP PLAN]                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🌱 POSSIBLE ALTERNATIVE                             │
│                                                     │
│ Groundnut — 88% suitable                            │
│ Lower water requirement                              │
│                                                     │
│              [EXPLORE]                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🏠 Home   🌱 Crop   📊 Monitor   💰 Market   More  │
└─────────────────────────────────────────────────────┘
```

The dashboard is **not a menu of features**.

It should immediately communicate:

- Current crop condition
- Current distress risk
- Reasons for the risk
- Today's required activities
- Available interventions/support

---

# 2. 📊 Crop Monitoring Page

Click **Monitor**.

```text
CROP MONITORING

Paddy
2.5 acres

┌─────────────────────────┐
│ 🌱 CROP HEALTH          │
│                         │
│ NDVI: 0.42 ⚠️           │
│ Moderate Stress         │
└─────────────────────────┘

┌─────────────────────────┐
│ 💧 SOIL                 │
│                         │
│ Moisture: 18%           │
│ pH: 6.2                 │
│ Organic Carbon: Low     │
└─────────────────────────┘

┌─────────────────────────┐
│ 🌧️ WEATHER              │
│                         │
│ Rainfall ↓ 35%          │
│ Temperature: 32°C       │
│ Rain forecast: 65mm     │
└─────────────────────────┘

[View Field Map]
[View Historical Data]
```

This page can contain:

- Weather
- Soil
- Soil moisture
- NDVI/EVI
- Historical trends
- Field map
- Crop-health indicators

---

# 3. 🚨 Risk Details Page

Click the 81/100 risk score.

```text
DISTRESS RISK

          81 / 100
           🔴 HIGH

Risk Breakdown

🌧️ Weather Risk      32/40
████████████████░░

💰 Market Risk       29/40
███████████████░░

💳 Financial Risk    20/20
██████████████████

────────────────────

WHY?

• Rainfall 35% below normal
• Soil moisture critically low
• Paddy price ↓ 22%
• Loan due in 8 days

────────────────────

RISK TREND

60 → 67 → 72 → 81 🔴

[View Recommended Actions]
```

This is an important judging screen because it demonstrates:

- Explainable AI
- Risk scoring
- Risk factors
- Historical trend
- Recommended intervention

---

# 4. 🌱 Crop Details / Farming Plan

Click **Crop**.

```text
MY CROP

🌾 Paddy

Sown:
12 July

Current stage:
Vegetative Stage

Health:
⚠️ Moderate Stress

────────────────

📅 FARMING CALENDAR

✓ Land preparation
✓ Sowing

→ TODAY
  Soil moisture inspection

○ Fertilizer application
  Due in 5 days

○ Weed management
  Due in 9 days

○ Disease monitoring
  Due in 15 days

[Full Crop Guide]
```

---

# 5. 📅 Full Crop Guide

This is where the farming-activity and "how/when to grow" functionality lives.

```text
PADDY — COMPLETE FARMING GUIDE

1️⃣ LAND PREPARATION
When: Week 1

2️⃣ SOWING
When: Week 2

3️⃣ IRRIGATION
When: According to crop stage
and local conditions

4️⃣ NUTRIENT MANAGEMENT
When: ...

5️⃣ WEED MANAGEMENT
When: ...

6️⃣ PEST / DISEASE MONITORING
When: ...

7️⃣ HARVEST
When: ...

[Listen in Odia 🔊]
```

For a recommended alternative crop:

```text
Recommended Crop
      ↓
Crop Guide
      ↓
Farming Calendar
      ↓
Activities and Advisory
```

The recommendation should therefore be more than:

> "Grow groundnut."

It should be:

> **Groundnut is suitable → here's why → here's how to grow it → here's your activity calendar.**

---

# 6. 🌱 Alternative Crop Recommendation

This should be accessible from the dashboard when distress is detected.

```text
ALTERNATIVE CROP OPTIONS

Your current crop is experiencing
increasing water stress.

Based on:

✓ Soil
✓ Weather
✓ Season
✓ Water availability
✓ Market
✓ Location

We recommend:

🥜 GROUNDNUT
Suitability: 88%

💧 Water: Low
📅 Duration: ~XX days
💰 Market: Favorable

[VIEW FARMING PLAN]

────────────────

🌽 MAIZE
Suitability: 81%

[VIEW FARMING PLAN]
```

This makes crop recommendation part of **distress prevention**, rather than a separate feature.

---

# 7. 💰 Market Page

```text
MARKET

Current crop: Paddy

Nearby Mandis

Baripada     ₹2,200
Balasore     ₹2,350
Jaleswar     ₹2,280
Bhadrak      ₹2,410 ⭐

────────────────

TRANSPORT

Bhadrak: ₹120/qtl

NET REALIZATION

₹2,410 - ₹120
= ₹2,290/qtl

🏆 Best option: Bhadrak

[Compare All Markets]
```

The market module can support:

- Mandi prices
- Price trends
- Nearby markets
- Transport costs
- Net realization
- MSP comparison

---

# 8. 🚜 Equipment Page

Equipment rental should be under **Services / More**, not on the main dashboard.

```text
FARM EQUIPMENT

Available near you

🚜 Tractor
₹900/hour
5 km away

[Rent]

🌾 Seeder
₹500/hour
3 km away

[Rent]

💧 Water Pump
₹300/day
2 km away

[Rent]
```

## Equipment Rental Detail

```text
TRACTOR

Available: 🟢

₹900/hour

Date: [     ]
Time: [     ]
Duration: [     ]

Estimated cost: ₹3,600

[CONFIRM RENTAL]
```

---

# 9. 🛡️ Insurance Page

```text
CROP INSURANCE

Your current status

⚠️ NOT REGISTERED

Crop: Paddy
Area: 2.5 acres

────────────────

Why insurance matters

Your crop currently has:
🔴 High distress risk

You may be eligible for
crop insurance.

[CHECK ELIGIBILITY]
[REGISTER]
```

This connects the farmer side to the bank/insurance workflow.

---

# 10. 🏛️ Government Schemes Page

```text
GOVERNMENT SUPPORT

Based on your profile:

✓ Odisha
✓ Paddy
✓ 2.5 acres
✓ Farmer category

Potential matches:

🏛️ Scheme A
Eligibility: 92%

🚜 Equipment Subsidy
Eligibility: 87%

💧 Irrigation Support
Eligibility: 78%

[VIEW DETAILS]
```

The page can show:

- Scheme description
- Eligibility
- Required documents
- Application process
- Official information

---

# 11. 🔔 Notifications Page

```text
NOTIFICATIONS

🔴 HIGH PRIORITY
Your crop distress risk increased
to 81/100.

2 hours ago

🌧️ WEATHER
Heavy rainfall expected tomorrow.

5 hours ago

💰 MARKET
Paddy price decreased 8%.

Yesterday

📅 FARM ACTIVITY
Soil inspection due today.

Today
```

Notifications can include:

- Risk alerts
- Weather alerts
- Market alerts
- Farming activity reminders
- Officer intervention updates

---

# 12. 👤 Farmer Profile

```text
PROFILE

Name: Ramesh
Village: XXXXX
District: Mayurbhanj

Language: Odia

Land: 2.5 acres

Current Crop: Paddy

Sowing Date: 12 July

────────────────

[Edit Profile]
[My Farms]
[Language]
[Notifications]
```

---

# 13. 🧑‍🌾 Agriculture Officer Dashboard

The officer dashboard focuses on **many farmers simultaneously**.

```text
┌──────────────────────────────────────────────────┐
│ 🚨 AGRICULTURAL DISTRESS COMMAND CENTER          │
│ Mayurbhanj District                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ 🔴 HIGH       🟡 MEDIUM       🟢 LOW             │
│   17             34             128              │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ 🚨 PRIORITY FARMERS                              │
│                                                  │
│ Ramesh    Paddy    81 🔴    Loan: 8 days        │
│ Suresh    Paddy    76 🔴    Rainfall risk       │
│ Anita     Maize    71 🔴    Price decline       │
│                                                  │
│              [VIEW ALL]                          │
├──────────────────────────────────────────────────┤
│                                                  │
│ 🗺️ DISTRESS MAP                                  │
│                                                  │
│       🔴       🟡                                │
│   🟢       🔴                                    │
│        🟡                                        │
├──────────────────────────────────────────────────┤
│                                                  │
│ 📊 DISTRICT STATISTICS                           │
│                                                  │
│ Farmers monitored: 1,248                        │
│ High-risk: 17                                    │
│ Increasing risk: 42                              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# 14. Officer → Farmer Details

Click a farmer such as Ramesh.

```text
RAMESH — FARMER MONITORING

Risk: 81 🔴 HIGH

Crop: Paddy
Area: 2.5 acres
Location: XXXXX

────────────────────

RISK FACTORS

Rainfall       ↓35%
Soil moisture  LOW
NDVI           ↓18%
Price          ↓22%
Loan           8 days

────────────────────

RECOMMENDED INTERVENTION

🔴 Field inspection
🛡️ Insurance registration
🌱 Alternative crop assessment

────────────────────

[CALL FARMER]
[SEND SMS]
[ASSIGN FIELD VISIT]
```

This is where the **human intervention** occurs.

---

# 15. 🏛️ Government / Equipment Dashboard

A separate massive government application is unnecessary.

One dashboard can manage:

```text
GOVERNMENT SERVICES

Equipment
├── Inventory
├── Availability
├── Rentals
└── Maintenance

Farmers
├── Registered farmers
└── Service requests

Schemes
├── Scheme database
└── Eligibility information
```

---

# 16. 🏦 Bank / Insurance Dashboard

```text
INSURANCE / BANK PORTAL

Farmers requiring registration

Ramesh    Paddy    2.5 acres    ⚠️
Suresh    Paddy    3 acres      ⚠️
Anita     Maize    1.8 acres    ✓

[REGISTER FARMER]

────────────────

Insurance status

Registered: 842
Pending: 126
Expired: 31
```

---

# Final Page Structure

## 👨‍🌾 Farmer

```text
LOGIN
  ↓
🏠 DASHBOARD
  │
  ├── 🚨 Risk Details
  │      └── Recommended Actions
  │
  ├── 📊 Crop Monitoring
  │      ├── Weather
  │      ├── Soil
  │      ├── Soil Moisture
  │      └── Satellite/NDVI
  │
  ├── 🌱 My Crop
  │      ├── Crop Details
  │      ├── Farming Calendar
  │      └── Crop Guide
  │
  ├── 🌱 Alternative Crops
  │      └── Crop Guide
  │
  ├── 💰 Market
  │      └── Mandi Comparison
  │
  └── MORE
         ├── 🚜 Equipment Rental
         ├── 🛡️ Insurance
         ├── 🏛️ Government Schemes
         ├── 🔔 Notifications
         └── 👤 Profile
```

## 🧑‍🌾 Officer

```text
LOGIN
  ↓
🚨 COMMAND CENTER
  │
  ├── High-Risk Farmers
  │      └── Farmer Details
  │
  ├── 🗺️ Distress Map
  │
  ├── 📊 Analytics
  │
  └── 🔔 Intervention / Alerts
```

## 🏛️ Government

```text
LOGIN
  ↓
GOVERNMENT DASHBOARD
  ├── Equipment
  ├── Rentals
  ├── Farmers
  └── Schemes
```

## 🏦 Bank / Insurer

```text
LOGIN
  ↓
INSURANCE DASHBOARD
  ├── Farmer Registration
  ├── Eligible Farmers
  ├── Insurance Status
  └── Crop / Risk Information
```

---

# Most Important Screen Hierarchy

For the SIH prototype, spend most of the UI effort on these five screens:

1. **Farmer Dashboard**
2. **Crop Monitoring**
3. **Risk Explanation**
4. **Crop Intervention / Advisory**
5. **Officer Command Center**

These five screens tell the complete story:

```text
Monitor crop
     ↓
Detect distress
     ↓
Explain why
     ↓
Recommend intervention
     ↓
Alert responsible officer
```

Everything else—crop recommendations, farming calendar, market, equipment, insurance, and schemes—supports this core flow.
