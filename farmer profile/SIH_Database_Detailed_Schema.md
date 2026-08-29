# SIH Database — Detailed Schema & Relationship Map

**Database:** `sih`  
**Total tables:** 26  
**Purpose:** Agricultural risk, market, farmer, financial, scheme, insurance, equipment, weather, and intervention platform.

> **Source of truth for relationships:** MySQL foreign-key output supplied for this database.
>
> **Important:** This document records the confirmed relationships and the confirmed table names. Column definitions for tables other than the ones previously inspected (`mandi_prices`, `risk_scores`, `risk_history`, `crops`, `farms`) should be filled from `DESCRIBE` / `SHOW CREATE TABLE` before treating this as a complete column-level DDL specification.

---

## 1. Table Inventory

| # | Table | Primary purpose |
|---:|---|---|
| 1 | `bank_users` | Bank-user accounts linked to banks |
| 2 | `banks` | Bank master data |
| 3 | `bookings` | Equipment bookings by farmers |
| 4 | `crop_risk` | Crop/farmer-specific risk information |
| 5 | `crops` | Farmer crop records |
| 6 | `equipment` | Agricultural equipment inventory |
| 7 | `equipment_rentals` | Farmer equipment rental records |
| 8 | `facility_analytics` | Analytics for financial facilities |
| 9 | `facility_benefits` | Benefits of financial facilities |
| 10 | `facility_documents` | Documents for financial facilities |
| 11 | `facility_eligibility` | Eligibility rules for financial facilities |
| 12 | `facility_terms` | Terms of financial facilities |
| 13 | `farmers` | Farmer master data |
| 14 | `farms` | Farmer farm/plot records |
| 15 | `financial_facilities` | Financial products/facilities offered by banks |
| 16 | `insurance` | Farmer insurance records |
| 17 | `interventions` | Officer/farmer risk interventions |
| 18 | `loans` | Farmer loans linked to banks |
| 19 | `mandi_prices` | Agricultural market/mandi price observations |
| 20 | `notifications` | Farmer notifications |
| 21 | `risk_history` | Historical farmer/crop risk scores |
| 22 | `risk_scores` | Current farmer risk score and risk components |
| 23 | `scheme_application_documents` | Documents attached to scheme applications |
| 24 | `scheme_applications` | Farmer applications to government schemes |
| 25 | `schemes` | Government scheme master data |
| 26 | `weather_observations` | Farm-specific weather observations |

---

# 2. Confirmed Foreign-Key Relationships

## Farmer domain

```text
farmers
├── farms
│   └── weather_observations
├── crops
│   └── crop_risk
│   └── risk_history
├── crop_risk
├── insurance
├── interventions
├── loans
├── notifications
├── risk_history
├── risk_scores
├── scheme_applications
├── bookings
└── equipment_rentals
```

### Confirmed relationships

| Child table | Child column | Parent table | Parent column |
|---|---|---|---|
| `farms` | `farmer_id` | `farmers` | `id` |
| `crops` | `farmer_id` | `farmers` | `id` |
| `crop_risk` | `farmer_id` | `farmers` | `id` |
| `insurance` | `farmer_id` | `farmers` | `id` |
| `interventions` | `farmer_id` | `farmers` | `id` |
| `loans` | `farmer_id` | `farmers` | `id` |
| `notifications` | `farmer_id` | `farmers` | `id` |
| `risk_history` | `farmer_id` | `farmers` | `id` |
| `risk_scores` | `farmer_id` | `farmers` | `id` |
| `scheme_applications` | `farmer_id` | `farmers` | `id` |
| `bookings` | `farmer_id` | `farmers` | `id` |
| `equipment_rentals` | `farmer_id` | `farmers` | `id` |

---

# 3. Confirmed Crop & Risk Relationships

```text
farmers
   │
   └── crops
         │
         ├── crop_risk
         └── risk_history

farmers
   └── risk_scores
```

### `crops`

Previously inspected columns:

| Column | Type | Null | Key |
|---|---|---|---|
| `id` | `varchar(30)` | NO | PRI |
| `farmer_id` | `varchar(30)` | NO | MUL |
| `name` | `varchar(100)` | NO | |
| `stage` | `varchar(50)` | NO | |
| `sowing_date` | `date` | NO | |

### Confirmed foreign key

```text
crops.farmer_id → farmers.id
```

---

## `crop_risk`

Confirmed foreign keys:

```text
crop_risk.crop_id   → crops.id
crop_risk.farmer_id → farmers.id
```

This table represents risk information associated with both a farmer and a crop.

---

## `risk_history`

Previously inspected columns:

| Column | Type | Null | Key |
|---|---|---|---|
| `id` | `varchar(30)` | NO | PRI |
| `farmer_id` | `varchar(30)` | NO | MUL |
| `crop_id` | `varchar(30)` | NO | MUL |
| `risk_score` | `tinyint unsigned` | NO | |
| `calculated_at` | `timestamp` | NO | DEFAULT CURRENT_TIMESTAMP |

Confirmed relationships:

```text
risk_history.farmer_id → farmers.id
risk_history.crop_id   → crops.id
```

This supports historical risk trends.

---

## `risk_scores`

Previously inspected columns:

| Column | Type | Null | Key |
|---|---|---|---|
| `id` | `varchar(30)` | NO | PRI |
| `farmer_id` | `varchar(30)` | NO | MUL |
| `score` | `tinyint unsigned` | NO | |
| `rainfall_risk` | `tinyint unsigned` | NO | |
| `market_risk` | `tinyint unsigned` | NO | |
| `loan_risk` | `tinyint unsigned` | NO | |
| `reasons` | `json` | NO | |
| `created_at` | `timestamp` | NO | DEFAULT CURRENT_TIMESTAMP |

Confirmed relationship:

```text
risk_scores.farmer_id → farmers.id
```

### Risk architecture

```text
Weather observations ─┐
Market prices ────────┼──> Risk calculation ──> risk_scores
Loans ────────────────┘                         │
                                                └──> risk_history
```

> Note: the database confirms `risk_scores.market_risk`, but the actual backend calculation connecting `mandi_prices` to `risk_scores` must be implemented and verified separately.

---

# 4. Farm & Weather Relationships

## `farms`

Previously inspected columns:

| Column | Type | Null | Key |
|---|---|---|---|
| `id` | `varchar(30)` | NO | PRI |
| `farmer_id` | `varchar(30)` | NO | MUL |
| `name` | `varchar(150)` | NO | |
| `latitude` | `decimal(10,7)` | NO | |
| `longitude` | `decimal(10,7)` | NO | |
| `area` | `decimal(10,2)` | NO | |
| `soil_type` | `varchar(100)` | NO | |
| `village` | `varchar(150)` | NO | |
| `district` | `varchar(100)` | NO | |

Confirmed relationship:

```text
farms.farmer_id → farmers.id
```

---

## `weather_observations`

Confirmed relationship:

```text
weather_observations.farm_id → farms.id
```

This gives the database a farm-level weather relationship:

```text
farmers
   ↓
farms
   ↓
weather_observations
```

---

# 5. Market Module

## `mandi_prices`

Previously inspected columns:

| Column | Type | Null | Key |
|---|---|---|---|
| `id` | `varchar(30)` | NO | PRI |
| `crop_id` | `varchar(30)` | NO | MUL |
| `mandi_name` | `varchar(150)` | NO | |
| `district` | `varchar(100)` | NO | |
| `modal_price` | `decimal(10,2)` | NO | |
| `price_date` | `date` | NO | |
| `mandi_location` | `varchar(255)` | YES | |
| `price` | `decimal(10,2)` | YES | |
| `min_price` | `decimal(10,2)` | YES | |
| `max_price` | `decimal(10,2)` | YES | |
| `msp` | `decimal(10,2)` | YES | |

The database confirms that `crop_id` is indexed (`MUL`).

### Important verification

The foreign-key output supplied does **not** show a foreign key from:

```text
mandi_prices.crop_id → crops.id
```

Therefore, this relationship should **not be assumed to be an actual FK yet**.

Conceptually, the Market module should work as:

```text
crops
   │
   │ crop_id
   ▼
mandi_prices
   │
   ├── current price
   ├── historical price
   ├── min/max price
   ├── modal price
   └── MSP
          │
          ▼
    Market Risk
          │
          ▼
risk_scores.market_risk
```

### Market database conclusion

No additional market table is required based on the current schema.

The important checks are:

1. Whether `mandi_prices.crop_id` should have an FK to `crops.id`.
2. Whether sufficient historical rows exist for price-trend calculations.
3. Whether backend logic actually calculates `market_risk`.

---

# 6. Equipment & Rental Domain

```text
equipment
   │
   ├── bookings
   └── equipment_rentals

farmers
   ├── bookings
   └── equipment_rentals
```

Confirmed FKs:

```text
bookings.equipment_id → equipment.id
bookings.farmer_id    → farmers.id

equipment_rentals.equipment_id → equipment.id
equipment_rentals.farmer_id    → farmers.id
```

This supports both equipment booking and rental workflows.

---

# 7. Banking & Financial Facilities

```text
banks
├── bank_users
├── financial_facilities
└── loans

financial_facilities
├── facility_analytics
├── facility_benefits
├── facility_documents
├── facility_eligibility
└── facility_terms
```

Confirmed relationships:

```text
bank_users.bank_id → banks.id

financial_facilities.bank_id → banks.id

loans.bank_id → banks.id
loans.farmer_id → farmers.id
```

Facility sub-tables:

```text
facility_analytics.facility_id   → financial_facilities.id
facility_benefits.facility_id    → financial_facilities.id
facility_documents.facility_id   → financial_facilities.id
facility_eligibility.facility_id → financial_facilities.id
facility_terms.facility_id       → financial_facilities.id
```

---

# 8. Insurance

Confirmed relationship:

```text
insurance.farmer_id → farmers.id
```

This associates insurance records with farmers.

---

# 9. Intervention System

Confirmed relationships:

```text
interventions.farmer_id → farmers.id
interventions.risk_id   → crop_risk.id
```

Logical workflow:

```text
crop_risk
    ↓
intervention
    ↓
farmer
```

This supports the officer workflow around a detected crop risk.

---

# 10. Notifications

Confirmed relationship:

```text
notifications.farmer_id → farmers.id
```

This supports farmer-facing alerts.

---

# 11. Government Scheme System

```text
schemes
   ↓
scheme_applications
   ↓
scheme_application_documents
```

Confirmed relationships:

```text
scheme_applications.scheme_id → schemes.id
scheme_applications.farmer_id → farmers.id

scheme_application_documents.application_id
    → scheme_applications.id
```

This supports:

- Scheme catalogue
- Farmer applications
- Application documents

---

# 12. Complete Relationship Map

```text
                                   ┌──────────────┐
                                   │    banks     │
                                   └──────┬───────┘
                         ┌───────────────┼────────────────┐
                         ↓               ↓                ↓
                  bank_users    financial_facilities    loans
                                      │                ↑
                     ┌────────────────┼────────────┐   │
                     ↓                ↓            ↓   │
          facility_analytics  facility_benefits  ...   │
                                                         │
                                                         │
┌─────────────┐                                           │
│   farmers   │───────────────────────────────────────────┘
└──────┬──────┘
       │
       ├────────────── farms ───────────── weather_observations
       │
       ├────────────── crops ───────────── crop_risk
       │                  │                  │
       │                  │                  └── interventions
       │                  └────────────── risk_history
       │
       ├────────────── risk_scores
       ├────────────── risk_history
       ├────────────── insurance
       ├────────────── interventions
       ├────────────── notifications
       │
       ├────────────── bookings ─────────── equipment
       │                                      ↑
       └────────────── equipment_rentals ────┘

       └────────────── scheme_applications ── schemes
                              │
                              └── scheme_application_documents

crops ──(conceptual crop_id relationship; FK not confirmed)──> mandi_prices

mandi_prices ──> market-risk calculation ──> risk_scores.market_risk
```

---

# 13. Database Integrity Items to Verify

Based on the FK output, these are the main things that deserve attention.

## 🔴 1. `mandi_prices.crop_id`

It is indexed but **no FK was shown**.

If every market price must correspond to an existing crop master record, consider:

```sql
ALTER TABLE mandi_prices
ADD CONSTRAINT fk_mandi_prices_crop
FOREIGN KEY (crop_id) REFERENCES crops(id);
```

Before doing this, check for orphaned `crop_id` values.

---

## 🟠 2. `risk_scores` is farmer-level

Current relationship:

```text
risk_scores.farmer_id → farmers.id
```

There is no `crop_id`.

Meanwhile `risk_history` is:

```text
farmer_id + crop_id
```

If the application needs separate current risk for multiple crops owned by the same farmer, this is a design issue to review.

---

## 🟠 3. `interventions.risk_id` points to `crop_risk`

That is valid if `crop_risk` is your authoritative crop-risk entity.

But the system also has `risk_scores`.

Make sure the application clearly distinguishes:

```text
crop_risk   = crop-specific risk record
risk_scores = current aggregated farmer risk
risk_history = historical risk measurements
```

Otherwise duplicate risk concepts can become confusing.

---

# 14. Market Module: Final Database Status

### Database tables required

```text
mandi_prices       ✅
crops              ✅
risk_scores        ✅
risk_history       ✅
farmers             ✅
farms               ✅
```

### New market table required?

**No.**

### Main remaining work

```text
mandi_prices
     ↓
market trend calculation
     ↓
market risk score
     ↓
risk_scores.market_risk
     ↓
overall farmer risk
```

That is primarily **backend/business logic**, not additional database-table work.

---

# 15. Important Limitation of This Document

The foreign-key list supplied confirms the relationships above, but it does not contain:

- Full column definitions for all 26 tables
- Index definitions
- `ON DELETE` rules
- `ON UPDATE` rules
- Unique constraints
- Check constraints
- Exact storage engines
- Character sets/collations
- Default values for every column

Therefore, this should be treated as the **current schema/relationship audit**, not a replacement for the exact MySQL `SHOW CREATE TABLE` output.

To generate a true production-ready DDL/schema document, collect:

```sql
SHOW CREATE TABLE <table_name>;
```

for all 26 tables, or export the database structure using:

```bash
mysqldump --no-data sih
```

Then the exact SQL definitions can be documented without guessing.
