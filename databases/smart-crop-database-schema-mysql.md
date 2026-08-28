# Smart Crop — Database Schema (MySQL)

Converted from the Prisma/PostgreSQL data model in `smart-crop-prd.md` §9,
plus two additions covering features already built in this project that
aren't in the original PRD schema (see Part 2). Engine `InnoDB` throughout
for foreign-key support; charset `utf8mb4` throughout — not optional here,
since farmer/village names and scheme text need to store Odia (Oriya)
script correctly, per the app's Odia-first design.

> **Note on IDs:** the original model uses Prisma's `cuid()`, which is
> generated in application code, not by the database. MySQL has no
> built-in equivalent, so every `id` column below is `VARCHAR(30)` with no
> `DEFAULT` — your app/ORM layer must generate and supply the id on insert,
> same as it already does with Prisma. If you'd rather have the database
> generate ids, swap these for `CHAR(36)` + `UUID()`, noted inline where
> relevant.

---

## Part 1 — Core Schema (from the PRD, translated as-is)

```sql
CREATE DATABASE IF NOT EXISTS smart_crop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_crop;

-- ─────────────────────────────────────────────
-- Farmer — data foundation
-- ─────────────────────────────────────────────
CREATE TABLE farmers (
    id             VARCHAR(30)     NOT NULL,
    name           VARCHAR(150)    NOT NULL,
    phone          VARCHAR(15)     NOT NULL,
    district       VARCHAR(100)    NOT NULL,
    village        VARCHAR(150)    NOT NULL,
    language       VARCHAR(30)     NOT NULL,
    land_area      DECIMAL(6,2)    NOT NULL,          -- acres
    loan_amount    DECIMAL(12,2)   NULL,
    loan_due_date  DATE            NULL,
    created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_farmers_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Crop — one farmer can have multiple crop records over time
-- ─────────────────────────────────────────────
CREATE TABLE crops (
    id           VARCHAR(30)   NOT NULL,
    farmer_id    VARCHAR(30)   NOT NULL,
    name         VARCHAR(100)  NOT NULL,
    stage        VARCHAR(50)   NOT NULL,   -- e.g. 'Vegetative Stage'
    sowing_date  DATE          NOT NULL,
    PRIMARY KEY (id),
    KEY idx_crops_farmer (farmer_id),
    CONSTRAINT fk_crops_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Risk Score — Distress Engine output, one row per calculation
-- ─────────────────────────────────────────────
CREATE TABLE risk_scores (
    id             VARCHAR(30)  NOT NULL,
    farmer_id      VARCHAR(30)  NOT NULL,
    score          TINYINT UNSIGNED NOT NULL,   -- 0–100
    rainfall_risk  TINYINT UNSIGNED NOT NULL,
    market_risk    TINYINT UNSIGNED NOT NULL,
    loan_risk      TINYINT UNSIGNED NOT NULL,
    reasons        JSON         NOT NULL,       -- Prisma String[] → JSON array
                                                 -- e.g. ["Rainfall 35% below normal", "Loan due in 8 days"]
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_risk_scores_farmer_time (farmer_id, created_at),  -- powers the risk-trend chart (60→67→72→81)
    CONSTRAINT fk_risk_scores_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Mandi Price — daily market price snapshots, not farmer-specific
-- ─────────────────────────────────────────────
CREATE TABLE mandi_prices (
    id           VARCHAR(30)    NOT NULL,
    crop         VARCHAR(100)   NOT NULL,
    mandi        VARCHAR(150)   NOT NULL,
    district     VARCHAR(100)   NOT NULL,
    modal_price  DECIMAL(10,2)  NOT NULL,   -- ₹ per quintal
    price_date   DATE           NOT NULL,   -- renamed from `date` (reserved-adjacent)
    PRIMARY KEY (id),
    KEY idx_mandi_prices_lookup (crop, district, price_date)  -- powers "nearby mandis for my crop"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Equipment — rental inventory
-- ─────────────────────────────────────────────
CREATE TABLE equipment (
    id          VARCHAR(30)    NOT NULL,
    name        VARCHAR(100)   NOT NULL,
    owner_type  VARCHAR(30)    NOT NULL,   -- 'government' | 'farmer'
    daily_rate  DECIMAL(10,2)  NOT NULL,
    available   BOOLEAN        NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Booking — farmer ↔ equipment rental
-- ─────────────────────────────────────────────
CREATE TABLE bookings (
    id            VARCHAR(30)   NOT NULL,
    farmer_id     VARCHAR(30)   NOT NULL,
    equipment_id  VARCHAR(30)   NOT NULL,
    start_date    DATE          NOT NULL,
    end_date      DATE          NOT NULL,
    status        VARCHAR(30)   NOT NULL,   -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
    PRIMARY KEY (id),
    KEY idx_bookings_farmer (farmer_id),
    KEY idx_bookings_equipment (equipment_id),
    CONSTRAINT fk_bookings_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_bookings_equipment
        FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Insurance — registration + status tracking
-- ─────────────────────────────────────────────
CREATE TABLE insurance (
    id         VARCHAR(30)   NOT NULL,
    farmer_id  VARCHAR(30)   NOT NULL,
    crop       VARCHAR(100)  NOT NULL,
    status     VARCHAR(30)   NOT NULL,   -- 'not_registered' | 'pending' | 'approved'
    PRIMARY KEY (id),
    KEY idx_insurance_farmer (farmer_id),
    CONSTRAINT fk_insurance_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Scheme — the curated scheme database (not farmer-specific)
-- ─────────────────────────────────────────────
CREATE TABLE schemes (
    id               VARCHAR(30)    NOT NULL,
    name             VARCHAR(200)   NOT NULL,   -- e.g. 'PM-KISAN'
    state            VARCHAR(100)   NOT NULL,
    eligibility      TEXT           NOT NULL,   -- plain-language eligibility rules
    documents        JSON           NOT NULL,   -- Prisma String[] → JSON array
    application_url  VARCHAR(500)   NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Part 2 — Extensions for features already built (not in the original PRD)

The PRD's `Scheme` model only stores the scheme itself — it has no way to
record a *specific farmer's* match %, per-farmer document checklist
progress, or application status. But the Government Schemes feature you've
already built (eligibility %, document checklist, Submitted → Verification
→ Approved tracker) needs exactly that. Same story for Notifications —
there's no table for it anywhere in the original PRD at all, despite it
being a fully built page. Adding both here so the schema actually matches
what the app does today.

```sql
-- ─────────────────────────────────────────────
-- Scheme Application — one row per (farmer, scheme) match
-- Powers: eligibility %, "why you qualify" reasons, application tracker
-- ─────────────────────────────────────────────
CREATE TABLE scheme_applications (
    id                  VARCHAR(30)   NOT NULL,
    farmer_id           VARCHAR(30)   NOT NULL,
    scheme_id           VARCHAR(30)   NOT NULL,
    eligibility_percent TINYINT UNSIGNED NOT NULL,
    matched_reasons     JSON          NOT NULL,   -- e.g. ["Land size within limit", "Paddy eligible crop"]
    status              ENUM('not_applied','submitted','verification','approved','rejected')
                                      NOT NULL DEFAULT 'not_applied',
    rejection_reason    VARCHAR(255) NULL,
    submitted_at        TIMESTAMP    NULL,
    decided_at          TIMESTAMP    NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_farmer_scheme (farmer_id, scheme_id),   -- one match record per farmer per scheme
    KEY idx_scheme_applications_farmer (farmer_id),
    KEY idx_scheme_applications_scheme (scheme_id),
    CONSTRAINT fk_scheme_app_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_scheme_app_scheme
        FOREIGN KEY (scheme_id) REFERENCES schemes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Scheme Application Document — the document checklist per application
-- Powers: DocumentChecklist component (ready/missing, progress indicator)
-- ─────────────────────────────────────────────
CREATE TABLE scheme_application_documents (
    id              VARCHAR(30)   NOT NULL,
    application_id  VARCHAR(30)   NOT NULL,
    document_name   VARCHAR(150)  NOT NULL,   -- e.g. 'Aadhaar Card', 'Land Record (RoR)'
    status          ENUM('missing','ready')  NOT NULL DEFAULT 'missing',
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sad_application (application_id),
    CONSTRAINT fk_sad_application
        FOREIGN KEY (application_id) REFERENCES scheme_applications(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Notification — powers the Notifications feature end to end
-- ─────────────────────────────────────────────
CREATE TABLE notifications (
    id            VARCHAR(30)   NOT NULL,
    farmer_id     VARCHAR(30)   NOT NULL,
    category      ENUM('risk','weather','crop_activity','market',
                        'government','insurance','officer_update')
                                NOT NULL,
    priority      ENUM('critical','warning','info') NOT NULL,
    title         VARCHAR(200)  NOT NULL,
    description   TEXT          NOT NULL,
    action_label  VARCHAR(100)  NULL,          -- e.g. 'View Risk Details'
    action_href   VARCHAR(300)  NULL,          -- e.g. '/risk-details'
    is_read       BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_notifications_farmer_unread (farmer_id, is_read),  -- powers the bell badge count
    KEY idx_notifications_farmer_time (farmer_id, created_at), -- powers Today/Yesterday/Earlier grouping
    CONSTRAINT fk_notifications_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Entity Relationship Summary

```
farmers 1───* crops
farmers 1───* risk_scores
farmers 1───* bookings ───* equipment
farmers 1───* insurance
farmers 1───* scheme_applications ───* scheme_application_documents
                    │
                    *
                schemes
farmers 1───* notifications

mandi_prices — standalone, not tied to a farmer (matched at query time by crop + district)
```

## Notes

- **`reasons` and `documents` as JSON columns:** this mirrors the PRD's
  Prisma `String[]` fields directly. If you'd rather have these fully
  normalized (a `risk_score_reasons` table, a `scheme_documents` table),
  that's a valid alternative — JSON was chosen here to match the original
  model 1:1 rather than introduce a schema shape the PRD didn't specify.
- **Charset:** don't change `utf8mb4` to plain `utf8` anywhere — MySQL's
  legacy `utf8` is actually a 3-byte-max encoding that can silently
  corrupt some Unicode characters. `utf8mb4` is the one that's actually
  full Unicode, which matters for Odia script farmer/village names.
- **Your app's tech stack (§7 of the PRD) specifies PostgreSQL via
  Supabase/Neon**, not MySQL — this document is a straight translation in
  case you need a MySQL version for a separate deliverable (coursework,
  a different eval requirement, etc.). If the actual running app still
  uses Postgres, this schema is a reference, not a migration you should
  run against production data.
