# Smart Crop — Farmer Profile & Insurance
## Backend Product Requirements Document (PRD)

**Version:** 2.0 (consolidated)
**Status:** Implementation-ready / Hackathon Build
**Scope:** Backend for Farmer Profile + Farmer Insurance workflows only
**Companion document:** `farmer-profile-prd.md` (Farmer Profile frontend PRD — this backend supplies every field F1–F14 that page requires)

---

## 0. How to read this document

This PRD follows the 24-part structure requested for an implementation-ready backend spec:

1. Scope
2. Current-state problems
3. Target architecture
4. Entity relationships
5. ER diagram (text)
6. Database design
7. Prisma schema
8. Migration plan
9. API specification
10. Request/response JSON
11. Validation
12. Authorization
13. Ownership checks (IDOR)
14. Financial-data security
15. Audit logging
16. Risk integration
17. Insurance integration
18. Notification integration
19. Error handling
20. Edge cases
21. Seed data
22. Testing plan
23. Acceptance criteria
24. Definition of Done

Every new or changed schema element is explicitly labeled:

`[EXISTING]` `[NEW TABLE]` `[NEW FIELD]` `[MODIFICATION]` `[DERIVED FIELD]` `[DEPRECATED FIELD]`

---

## 1. Scope

### 1.1 In scope

**Farmer Profile**
- Farmer record (identity, contact, language, status)
- Farm/plot records (a farmer can have many)
- Crop records/history (a farm can have many, over time)
- Risk linkage (farm- and crop-scoped, with history)
- Financial linkage (bank accounts, loans, loan payments)
- Notifications
- Profile-update audit trail

**Insurance**
- Backward-compatible support for the existing `insurance` table
- Insurance connected to farmer → farm → crop (never bolted onto `Farmer`)
- Bank catalogue and bank-defined schemes
- Farmer scheme applications and insurance applications
- Future insurance policy and claim lifecycle (schema present, workflow gated)
- Secure document storage for supporting paperwork
- Approval/review workflow and full audit trail

### 1.2 Out of scope

- Full crop-monitoring backend (weather/soil ingestion pipelines)
- Weather and mandi price ingestion services
- The ML/risk-scoring model itself (this PRD defines where its *output* is stored, not how it's computed)
- Bank core-banking integration
- Real insurer integration (settlement, reinsurance, etc.)
- Payment settlement infrastructure
- Government ID/verification integration
- Frontend implementation (see the companion Farmer Profile frontend PRD)

### 1.3 Product context

Smart Crop's core loop is:

```
MONITOR → DETECT → PREDICT → EXPLAIN → INTERVENE → PREVENT
```

The Farmer Profile is the data foundation consumed by advisory, crop monitoring, the risk engine, financial-risk scoring, insurance, government schemes, officer intervention, and notifications. Every design decision below optimizes for that: profile data must be trustworthy, ownership-checked, and structured so the risk and insurance systems can consume it without ambiguity.

---

## 2. Current-state problems

### 2.1 Farmer Profile problems (all addressed below)

| # | Problem | Fix |
|---|---|---|
| 1 | Farmer and farm data are mixed conceptually | Split into `Farmer` and `Farm` |
| 2 | One farmer must support multiple farms | `Farm.farmerId` is 1–N |
| 3 | A farm must have its own identity | `Farm` gets its own `id`, label, timestamps |
| 4 | Crop must belong to a farm | `Crop.farmId` required FK |
| 5 | Farm must belong to a farmer | `Farm.farmerId` required FK |
| 6 | Farm location must be persisted | `Farm.village/district/state/lat/lng/boundary` |
| 7 | Crop season/history must be supportable | `Crop` rows are append-only per season |
| 8 | Current crop must not overwrite historical crop data | New `Crop` row per season instead of updating in place |
| 9 | Risk must identify the correct farm/crop | `RiskScore.farmId` + `cropId` required |
| 10 | Risk history must be retained | `RiskScore` is append-only, indexed by date |
| 11 | Financial data shouldn't live only as fields on `Farmer` | `Loan`, `LoanPayment`, `FarmerBankAccount` are separate tables |
| 12 | A farmer can have multiple loans | `Loan.farmerId` is 1–N |
| 13 | A farmer can have multiple bank accounts | `FarmerBankAccount.farmerId` is 1–N |
| 14 | A bank account belongs to a bank | `FarmerBankAccount.bankId` required FK |
| 15 | A loan belongs to a bank and farmer | `Loan.bankId` + `farmerId` required FK |
| 16 | Loan payments belong to a loan | `LoanPayment.loanId` required FK |
| 17 | Financial information is sensitive | Encryption + masking, see §14 |
| 18 | Farmers must only access their own data | Server-side ownership check, see §13 |
| 19 | Backend must enforce authorization | Role resolved server-side, never trusted from client |
| 20 | Never trust frontend-supplied `farmerId` | Identity resolved from the authenticated session, see §13 |
| 21 | Profile edits need validation | Zod schemas per entity, see §11 |
| 22 | Profile updates need auditability for sensitive fields | `AuditLog`, see §15 |
| 23 | Deleting a farmer must not destroy historical relationships | Soft delete only, see §8/§24 |
| 24 | Notifications must be associated with the correct farmer | `Notification.farmerId` required FK, always server-set |
| 25 | Insurance must connect to farmer/farm/crop without living inside `Farmer` | `InsuranceApplication` links all three; `Farmer` has zero insurance columns |

### 2.2 Insurance-specific problems

- The current `insurance` table (`id`, `farmer_id`, `crop`, `status`) has no policy number, provider, premium, coverage, claim, or dates — these are explicitly future work, not something to fake into existence now.
- Risk and insurance must never be conflated: a high risk score is *evidence*, not an approved claim. See the rule in §17.4.
- Bank schemes don't exist yet as data — they need their own table so eligibility rules aren't duplicated per application.

---

## 3. Target architecture

### 3.1 Stack

- Next.js 14+ (App Router) with Route Handlers
- TypeScript
- Prisma ORM
- PostgreSQL
- Supabase Auth (identity) + Supabase Storage (documents)
- Upstash Redis (rate limiting, idempotency keys)
- Zod (request validation)

### 3.2 High-level shape

```
Farmer
 ├── Farms
 │     └── Crops
 │           └── RiskScores
 │
 ├── Bank Accounts ──────── Bank
 ├── Loans ───────────────  Bank
 │     └── Loan Payments
 │
 ├── Scheme Applications ── Bank Scheme ── Bank
 ├── Insurance (legacy, read-compatible)
 ├── Insurance Applications
 │     ├── Insurance Policies (future)
 │     │     └── Insurance Claims (future)
 │     │           └── Claim Assessments (future)
 │     └── Documents
 │
 ├── Notifications
 ├── Interventions
 └── Audit Logs (as actor)
```

Design rule that governs every table below: **`Farmer` stays a thin identity record.** Everything domain-specific (land, crops, money, insurance) lives in its own table, linked by foreign key — never appended as a new column on `Farmer`.

---

## 4. Entity relationships

```
Farmer 1───N Farm
Farm   1───N Crop
Crop   1───N RiskScore

Bank   1───N FarmerBankAccount   N───1 Farmer
Bank   1───N Loan                N───1 Farmer
Loan   1───N LoanPayment

Bank   1───N BankScheme
Farmer 1───N FarmerSchemeApplication  N───1 BankScheme
Farm   1───N FarmerSchemeApplication
Crop   1───N FarmerSchemeApplication

Farmer 1───N Insurance                    (legacy, read-compatible)
Farmer 1───N InsuranceApplication  N───1 BankScheme
Farm   1───N InsuranceApplication
Crop   1───N InsuranceApplication
InsuranceApplication 1───N InsurancePolicy
InsurancePolicy      1───N InsuranceClaim
InsuranceClaim        1───N ClaimAssessment
(*)    1───N Document   (polymorphic owner: ownerType + ownerId)

Farmer 1───N Notification
Farmer 1───N Intervention
(actor)1───N AuditLog   (actor may be Farmer, Bank, Officer, Admin — actorId is not FK-constrained, see §15)
```

Cardinality notes:
- A `Crop` belongs to exactly one `Farm`; it is never reassigned to a different farm — a farm change means a new `Crop` row.
- A `LoanPayment` belongs to exactly one `Loan`; a `Loan` belongs to exactly one `Farmer` and one `Bank`.
- A `Document` uses a polymorphic `(ownerType, ownerId)` pair rather than one FK column per owner type, so new document-bearing entities don't require schema churn.

---

## 5. ER diagram (text)

```
┌──────────┐        ┌──────────┐        ┌──────────┐        ┌────────────┐
│  Farmer  │1──────N│   Farm   │1──────N│   Crop   │1──────N│ RiskScore  │
└────┬─────┘        └──────────┘        └────┬─────┘        └────────────┘
     │                                        │
     │1──────N ┌──────────────────┐           │N──────1 ┌────────────┐
     │         │FarmerBankAccount │N───────1──┼─────────│    Bank    │
     │         └──────────────────┘                      └─────┬──────┘
     │                                                          │1
     │1──────N ┌──────────┐  1────N ┌─────────────┐             │N
     │         │   Loan   │─────────│ LoanPayment │             │
     │         └──────────┘                                     │
     │                N───────────────────────────1─────────────┘
     │
     │1──────N ┌─────────────────────────┐N──────1┌────────────┐1──────N┌─────────────────────────┐
     │         │FarmerSchemeApplication  │────────│ BankScheme │────────│ (also FK'd from Farm,Crop)│
     │         └─────────────────────────┘        └────────────┘        └─────────────────────────┘
     │
     │1──────N ┌───────────┐   (legacy, read-compatible — farmer_id, crop, status only)
     │         │ Insurance │
     │         └───────────┘
     │
     │1──────N ┌───────────────────────┐1──────N┌──────────────────┐1──────N┌─────────────────┐1──────N┌──────────────────┐
     │         │ InsuranceApplication  │────────│ InsurancePolicy  │────────│ InsuranceClaim  │────────│ ClaimAssessment  │
     │         └───────────┬───────────┘        └──────────────────┘        └─────────────────┘        └──────────────────┘
     │                     │N──────1
     │                 ┌──────────┐
     │                 │ Document │ (ownerType + ownerId polymorphic — also attaches to claims, bank accounts, etc.)
     │                 └──────────┘
     │
     │1──────N ┌──────────────┐
     │         │ Notification │
     │         └──────────────┘
     │
     │1──────N ┌───────────────┐
     │         │ Intervention  │
     │         └───────────────┘
     │
     │1──────N ┌───────────┐
     └─────────│ AuditLog  │ (actorId — Farmer, Bank, Officer, Admin)
               └───────────┘
```

---

## 6. Database design

Status legend: `E` = existing, `N` = new table/field, `M` = modification, `D` = derived, `X` = deprecated.

### 6.1 Farmer — `[MODIFIED]`

| Field | Type | Status | Notes |
|---|---|---|---|
| id | string (cuid) | E | primary key |
| authUserId | string | N | Supabase auth uid, unique — the only identity link the backend trusts |
| name | string | E | |
| phone | string | E | unique |
| phoneVerifiedAt | datetime? | N | set on OTP verification |
| village | string | E | |
| district | string | E | |
| state | string | N | required for scheme/policy eligibility |
| language | enum(EN,HI,OR) | E | |
| status | enum(ACTIVE,INACTIVE,DEACTIVATED) | N | soft-delete flag |
| landArea | — | X | **deprecated** — moves to `Farm.area` |
| loanAmount | decimal | X | **deprecated** — becomes `Loan` records; see `legacyLoanAmount` below |
| loanDueDate | datetime | X | **deprecated** — becomes `Loan.dueDate`; see `legacyLoanDueDate` below |
| legacyLoanAmount | decimal? | D | read-only mirror of the single largest active loan, kept only until frontend migrates off it |
| legacyLoanDueDate | datetime? | D | same, for `dueDate` |
| createdAt / updatedAt / deactivatedAt | datetime | N/M | |

### 6.2 Farm — `[NEW TABLE]`

| Field | Type | Status | Required? |
|---|---|---|---|
| id | string | N | yes |
| farmerId | string (FK) | N | yes |
| label | string | N | yes — e.g. "Farm 01" |
| area | decimal | N | yes |
| village / district / state | string | N | yes |
| latitude / longitude | decimal? | N | optional |
| boundary | json? | N | optional GeoJSON polygon |
| soilRefId | string? | N | optional, points at a future soil-info table |
| status | enum(ACTIVE,INACTIVE) | N | yes |
| createdAt / updatedAt | datetime | N | yes |

### 6.3 Crop — `[MODIFIED — was a bare Farmer-linked table]`

| Field | Type | Status |
|---|---|---|
| id | string | E |
| farmId | string (FK) | **M** — was implicitly `farmerId`, now belongs to `Farm` |
| name | string | E |
| season | string | N |
| sowingDate | datetime | E |
| expectedHarvestDate | datetime? | N |
| stage | enum | E |
| area | decimal | N |
| status | enum(ACTIVE,HARVESTED,FAILED,ARCHIVED) | N |
| createdAt / updatedAt | datetime | N |

### 6.4 RiskScore — `[MODIFIED]`

| Field | Type | Status |
|---|---|---|
| id | string | E |
| farmerId | string | **M** — kept denormalized for fast farmer-level queries |
| farmId | string | **N** — required, was missing |
| cropId | string (FK) | **M** — now required, points at a specific crop/season |
| score / rainfallRisk / marketRisk / loanRisk | int | E |
| reasons | json | E |
| createdAt | datetime | E |

### 6.5 Bank — `[NEW/PLANNED, formalized]`

| Field | Type | Status |
|---|---|---|
| id | string | N |
| bankName / branchName / ifscCode / district / village | string | N (matches supplied baseline) |
| status | string | **N** — lifecycle addition |
| createdAt / updatedAt | datetime | **N** — lifecycle addition |

### 6.6 FarmerBankAccount — `[NEW/PLANNED, formalized]`

| Field | Type | Status |
|---|---|---|
| id | string | N |
| farmerId / bankId | string (FK) | N |
| accountNumberEnc | string | **N** — encrypted full number, never returned raw |
| accountNumberLast4 | string | **N** — used for masked display (`XXXXXX1234`) |
| accountType | enum(SAVINGS,CURRENT,KCC) | N |
| status | enum(PENDING_VERIFICATION,VERIFIED,REJECTED,INACTIVE) | N |
| createdAt / updatedAt | datetime | N |

Unique constraint: `(farmerId, bankId, accountNumberLast4)` — prevents obvious duplicate submissions without needing to compare encrypted values.

### 6.7 Loan — `[NEW/PLANNED, formalized]`

Matches the supplied baseline (`loan_id, farmer_id, bank_id, loan_type, loan_amount, outstanding_amount, interest_rate, sanction_date, due_date, status`) plus `createdAt/updatedAt` **[NEW FIELD]** for lifecycle tracking.

### 6.8 LoanPayment — `[NEW/PLANNED, formalized]`

Matches the supplied baseline exactly, plus `createdAt` **[NEW FIELD]**.

### 6.9 BankScheme — `[NEW TABLE]`

| Field | Type |
|---|---|
| id, bankId (FK) | string |
| schemeName, description | string |
| cropsCovered, eligibleLocations, eligibleSeasons, eligibilityRules, requiredDocuments | json (arrays/objects — see §6.13 note) |
| coverageAmount, premium, subsidy | decimal? (nullable — not every scheme publishes these) |
| policyPeriodMonths | int? |
| availabilityStatus | enum(ACTIVE,PAUSED,CLOSED) |
| createdAt / updatedAt | datetime |

### 6.10 FarmerSchemeApplication — `[NEW TABLE]`

Tracks *interest/eligibility* against a `BankScheme`, separate from the formal `InsuranceApplication`. Fields: `id, farmerId, farmId, cropId, bankSchemeId, status, eligibilitySnapshot (json), submittedAt, reviewedAt, reviewedBy, rejectionReason, createdAt, updatedAt`.

`eligibilitySnapshot` freezes the eligibility result at submit time so a later scheme-rule change doesn't silently rewrite history.

### 6.11 Insurance (legacy) — `[EXISTING, kept for compatibility]`

`id, farmer_id, crop, status (not_registered|pending|approved)`. Not written to by new code paths after migration Phase 6 — retained as a read-compatible view/table so nothing depending on it breaks mid-migration. See §8.

### 6.12 InsuranceApplication — `[NEW TABLE]`

`id, farmerId, farmId, cropId, bankSchemeId, status, applicationNumber (unique), submittedAt, reviewedAt, reviewedBy, rejectionReason, createdAt, updatedAt`.

Status values: `not_registered, eligible, application_started, pending, action_required, approved, rejected, policy_active`.

### 6.13 InsurancePolicy / InsuranceClaim / ClaimAssessment — `[NEW TABLE, future]`

Full field lists are in the Prisma schema (§7). These are schema-ready but workflow-gated: nothing in this PRD auto-creates a policy from an approved application, and nothing auto-creates a claim from a risk score. A human/bank action is required at each transition. See §17.4 for the hard rule.

> **Implementation note on JSON columns:** `cropsCovered`, `eligibleLocations`, `eligibleSeasons`, `eligibilityRules`, and `requiredDocuments` on `BankScheme` are JSON for MVP speed. If querying by crop/location becomes a bottleneck, normalize into child tables (`BankSchemeCrop`, `BankSchemeLocation`) later — the API contract in §9 doesn't change either way.

### 6.14 Document — `[NEW TABLE]`

Polymorphic owner: `ownerType (FARMER|FARM|BANK_ACCOUNT|LOAN|INSURANCE_APPLICATION|INSURANCE_CLAIM) + ownerId`. File bytes live in Supabase Storage; this table stores metadata + `storagePath` only.

### 6.15 Notification — `[EXISTING/NEW]`

`id, farmerId, type, title, message, isRead, createdAt, readAt, entityType, entityId`. `entityType/entityId` let a notification deep-link to the record that triggered it (a farm, a loan, an application) without a separate FK per type.

### 6.16 Intervention — `[EXISTING/NEW]`

`id, farmerId, officerId?, type, notes?, status (OPEN|IN_PROGRESS|RESOLVED|CLOSED), createdAt, updatedAt`.

### 6.17 AuditLog — `[NEW TABLE]`

`id, actorId, actorRole, entity, entityId, action, timestamp, metadata (json)`. `actorId` is intentionally **not** foreign-keyed to `Farmer` — actors can be bank staff, officers, or admins whose identity lives outside the `Farmer` table. Never store secrets or full account numbers in `metadata`.

---

## 7. Prisma schema

Complete, implementation-ready schema for everything in §6. Copy into `prisma/schema.prisma`; run `npx prisma migrate dev` against a fresh database, or see §8 for migrating an existing one.

```prisma
// ============================================================
// SMART CROP — Farmer Profile + Insurance
// Prisma schema (PostgreSQL)
// ============================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ------------------------------------------------------------
// ENUMS
// ------------------------------------------------------------

enum Role {
  FARMER
  BANK
  INSURER
  AGRICULTURE_OFFICER
  GOVERNMENT
  ADMIN
}

enum FarmerStatus {
  ACTIVE
  INACTIVE
  DEACTIVATED
}

enum Language {
  EN
  HI
  OR
}

enum FarmStatus {
  ACTIVE
  INACTIVE
}

enum CropStage {
  SOWN
  VEGETATIVE
  FLOWERING
  MATURITY
  HARVESTED
}

enum CropStatus {
  ACTIVE
  HARVESTED
  FAILED
  ARCHIVED
}

enum AccountType {
  SAVINGS
  CURRENT
  KCC
}

enum AccountStatus {
  PENDING_VERIFICATION
  VERIFIED
  REJECTED
  INACTIVE
}

enum LoanStatus {
  ACTIVE
  CLOSED
  DEFAULTED
  RESTRUCTURED
}

enum SchemeAvailability {
  ACTIVE
  PAUSED
  CLOSED
}

enum ApplicationStatus {
  NOT_REGISTERED
  ELIGIBLE
  APPLICATION_STARTED
  PENDING
  ACTION_REQUIRED
  APPROVED
  REJECTED
  POLICY_ACTIVE
}

enum LegacyInsuranceStatus {
  NOT_REGISTERED
  PENDING
  APPROVED
}

enum PolicyStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum ClaimStatus {
  SUBMITTED
  UNDER_ASSESSMENT
  APPROVED
  REJECTED
  SETTLED
}

enum DocumentOwnerType {
  FARMER
  FARM
  BANK_ACCOUNT
  LOAN
  INSURANCE_APPLICATION
  INSURANCE_CLAIM
}

enum DocumentStatus {
  UPLOADED
  PENDING
  VERIFIED
  REJECTED
}

enum NotificationType {
  WEATHER
  RISK
  MARKET
  FARMING_REMINDER
  OFFICER_UPDATE
  INSURANCE_APPLICATION
  INSURANCE_ACTION_REQUIRED
  INSURANCE_APPROVED
  INSURANCE_REJECTED
}

enum InterventionStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

// ------------------------------------------------------------
// FARMER PROFILE DOMAIN
// ------------------------------------------------------------

model Farmer {
  id              String       @id @default(cuid())
  authUserId      String       @unique
  name            String
  phone           String       @unique
  phoneVerifiedAt DateTime?
  village         String
  district        String
  state           String
  language        Language     @default(EN)
  status          FarmerStatus @default(ACTIVE)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deactivatedAt   DateTime?

  // [DERIVED FIELD] read-only mirror, retained only until frontend fully
  // migrates off Farmer.loanAmount / Farmer.loanDueDate
  legacyLoanAmount  Decimal?  @db.Decimal(12, 2)
  legacyLoanDueDate DateTime?

  farms                 Farm[]
  bankAccounts          FarmerBankAccount[]
  loans                 Loan[]
  schemeApplications    FarmerSchemeApplication[]
  insurance             Insurance[]
  insuranceApplications InsuranceApplication[]
  notifications         Notification[]
  interventions         Intervention[]

  @@index([district, village])
  @@map("farmers")
}

model Farm {
  id         String     @id @default(cuid())
  farmerId   String
  farmer     Farmer     @relation(fields: [farmerId], references: [id])
  label      String
  area       Decimal    @db.Decimal(10, 2)
  village    String
  district   String
  state      String
  latitude   Decimal?   @db.Decimal(9, 6)
  longitude  Decimal?   @db.Decimal(9, 6)
  boundary   Json?
  soilRefId  String?
  status     FarmStatus @default(ACTIVE)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  crops                 Crop[]
  schemeApplications    FarmerSchemeApplication[]
  insuranceApplications InsuranceApplication[]

  @@index([farmerId])
  @@map("farms")
}

model Crop {
  id                  String     @id @default(cuid())
  farmId              String
  farm                Farm       @relation(fields: [farmId], references: [id])
  name                String
  season              String
  sowingDate          DateTime
  expectedHarvestDate DateTime?
  stage               CropStage  @default(SOWN)
  area                Decimal    @db.Decimal(10, 2)
  status              CropStatus @default(ACTIVE)
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt

  riskScores            RiskScore[]
  schemeApplications    FarmerSchemeApplication[]
  insuranceApplications InsuranceApplication[]

  @@index([farmId, status])
  @@map("crops")
}

model RiskScore {
  id           String   @id @default(cuid())
  farmerId     String
  farmId       String
  cropId       String
  crop         Crop     @relation(fields: [cropId], references: [id])
  score        Int
  rainfallRisk Int
  marketRisk   Int
  loanRisk     Int
  reasons      Json
  createdAt    DateTime @default(now())

  @@index([farmerId, createdAt])
  @@index([farmId, createdAt])
  @@index([cropId, createdAt])
  @@map("risk_scores")
}

// ------------------------------------------------------------
// FINANCIAL DOMAIN
// ------------------------------------------------------------

model Bank {
  id         String   @id @default(cuid())
  bankName   String
  branchName String
  ifscCode   String   @unique
  district   String
  village    String
  status     String   @default("ACTIVE")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  accounts FarmerBankAccount[]
  loans    Loan[]
  schemes  BankScheme[]

  @@map("banks")
}

model FarmerBankAccount {
  id                 String        @id @default(cuid())
  farmerId           String
  farmer             Farmer        @relation(fields: [farmerId], references: [id])
  bankId             String
  bank               Bank          @relation(fields: [bankId], references: [id])
  accountNumberEnc   String
  accountNumberLast4 String
  accountType        AccountType
  status             AccountStatus @default(PENDING_VERIFICATION)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  @@unique([farmerId, bankId, accountNumberLast4])
  @@index([farmerId])
  @@map("farmer_bank_accounts")
}

model Loan {
  id                String     @id @default(cuid())
  farmerId          String
  farmer            Farmer     @relation(fields: [farmerId], references: [id])
  bankId            String
  bank              Bank       @relation(fields: [bankId], references: [id])
  loanType          String
  loanAmount        Decimal    @db.Decimal(12, 2)
  outstandingAmount Decimal    @db.Decimal(12, 2)
  interestRate      Decimal    @db.Decimal(5, 2)
  sanctionDate      DateTime
  dueDate           DateTime
  status            LoanStatus @default(ACTIVE)
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  payments LoanPayment[]

  @@index([farmerId, status])
  @@index([dueDate])
  @@map("loans")
}

model LoanPayment {
  id              String   @id @default(cuid())
  loanId          String
  loan            Loan     @relation(fields: [loanId], references: [id])
  amountPaid      Decimal  @db.Decimal(12, 2)
  paymentDate     DateTime
  remainingAmount Decimal  @db.Decimal(12, 2)
  createdAt       DateTime @default(now())

  @@index([loanId, paymentDate])
  @@map("loan_payments")
}

// ------------------------------------------------------------
// BANK SCHEME / APPLICATION DOMAIN
// ------------------------------------------------------------

model BankScheme {
  id                 String             @id @default(cuid())
  bankId             String
  bank               Bank               @relation(fields: [bankId], references: [id])
  schemeName         String
  description        String
  cropsCovered       Json
  eligibleLocations  Json
  eligibleSeasons    Json
  eligibilityRules   Json
  coverageAmount     Decimal?           @db.Decimal(12, 2)
  premium            Decimal?           @db.Decimal(12, 2)
  subsidy            Decimal?           @db.Decimal(12, 2)
  policyPeriodMonths Int?
  requiredDocuments  Json
  availabilityStatus SchemeAvailability @default(ACTIVE)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  farmerApplications    FarmerSchemeApplication[]
  insuranceApplications InsuranceApplication[]

  @@index([bankId, availabilityStatus])
  @@map("bank_schemes")
}

model FarmerSchemeApplication {
  id                  String            @id @default(cuid())
  farmerId            String
  farmer              Farmer            @relation(fields: [farmerId], references: [id])
  farmId              String
  farm                Farm              @relation(fields: [farmId], references: [id])
  cropId              String
  crop                Crop              @relation(fields: [cropId], references: [id])
  bankSchemeId        String
  bankScheme          BankScheme        @relation(fields: [bankSchemeId], references: [id])
  status              ApplicationStatus @default(ELIGIBLE)
  eligibilitySnapshot Json
  submittedAt         DateTime?
  reviewedAt          DateTime?
  reviewedBy          String?
  rejectionReason     String?
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt

  @@index([farmerId, status])
  @@map("farmer_scheme_applications")
}

// ------------------------------------------------------------
// INSURANCE DOMAIN
// ------------------------------------------------------------

/// [EXISTING] Legacy MVP table — kept read-compatible during migration.
/// New code paths stop writing to this after Migration Phase 6 (§8).
model Insurance {
  id       String                @id @default(cuid())
  farmerId String
  farmer   Farmer                @relation(fields: [farmerId], references: [id])
  crop     String
  status   LegacyInsuranceStatus @default(NOT_REGISTERED)

  @@map("insurance")
}

model InsuranceApplication {
  id                String            @id @default(cuid())
  farmerId          String
  farmer            Farmer            @relation(fields: [farmerId], references: [id])
  farmId            String
  farm              Farm              @relation(fields: [farmId], references: [id])
  cropId            String
  crop              Crop              @relation(fields: [cropId], references: [id])
  bankSchemeId      String
  bankScheme        BankScheme        @relation(fields: [bankSchemeId], references: [id])
  status            ApplicationStatus @default(NOT_REGISTERED)
  applicationNumber String            @unique
  submittedAt       DateTime?
  reviewedAt        DateTime?
  reviewedBy        String?
  rejectionReason   String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  policies  InsurancePolicy[]
  documents Document[]

  @@index([farmerId, status])
  @@map("insurance_applications")
}

/// [NEW / FUTURE] Not created automatically — see §17.4.
model InsurancePolicy {
  id             String       @id @default(cuid())
  applicationId  String
  application    InsuranceApplication @relation(fields: [applicationId], references: [id])
  farmerId       String
  farmId         String
  cropId         String
  providerId     String?
  bankId         String?
  policyNumber   String       @unique
  coverageAmount Decimal      @db.Decimal(12, 2)
  premium        Decimal      @db.Decimal(12, 2)
  subsidy        Decimal?     @db.Decimal(12, 2)
  startDate      DateTime
  endDate        DateTime
  status         PolicyStatus @default(ACTIVE)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  claims InsuranceClaim[]

  @@index([farmerId, status])
  @@map("insurance_policies")
}

/// [NEW / FUTURE] A claim must always reference a policy.
model InsuranceClaim {
  id             String      @id @default(cuid())
  policyId       String
  policy         InsurancePolicy @relation(fields: [policyId], references: [id])
  incidentDate   DateTime
  submittedAt    DateTime    @default(now())
  description    String
  status         ClaimStatus @default(SUBMITTED)
  claimedAmount  Decimal     @db.Decimal(12, 2)
  approvedAmount Decimal?    @db.Decimal(12, 2)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  assessments ClaimAssessment[]

  @@index([policyId, status])
  @@map("insurance_claims")
}

/// [NEW / FUTURE]
model ClaimAssessment {
  id               String   @id @default(cuid())
  claimId          String
  claim            InsuranceClaim @relation(fields: [claimId], references: [id])
  assessorId       String
  assessmentDate   DateTime
  assessmentResult String
  damagePercentage Decimal  @db.Decimal(5, 2)
  notes            String?
  status           String
  createdAt        DateTime @default(now())

  @@index([claimId])
  @@map("claim_assessments")
}

// ------------------------------------------------------------
// DOCUMENTS
// ------------------------------------------------------------

model Document {
  id           String            @id @default(cuid())
  ownerType    DocumentOwnerType
  ownerId      String
  documentType String
  storagePath  String
  fileName     String
  mimeType     String
  fileSize     Int
  status       DocumentStatus    @default(UPLOADED)
  uploadedBy   String
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  insuranceApplicationId String?
  insuranceApplication   InsuranceApplication? @relation(fields: [insuranceApplicationId], references: [id])

  @@index([ownerType, ownerId])
  @@map("documents")
}

// ------------------------------------------------------------
// NOTIFICATIONS, INTERVENTIONS, AUDIT
// ------------------------------------------------------------

model Notification {
  id         String           @id @default(cuid())
  farmerId   String
  farmer     Farmer           @relation(fields: [farmerId], references: [id])
  type       NotificationType
  title      String
  message    String
  isRead     Boolean          @default(false)
  createdAt  DateTime         @default(now())
  readAt     DateTime?
  entityType String?
  entityId   String?

  @@index([farmerId, isRead])
  @@map("notifications")
}

model Intervention {
  id        String              @id @default(cuid())
  farmerId  String
  farmer    Farmer              @relation(fields: [farmerId], references: [id])
  officerId String?
  type      String
  notes     String?
  status    InterventionStatus  @default(OPEN)
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt

  @@index([farmerId, status])
  @@map("interventions")
}

/// actorId is intentionally not FK-constrained — actors include bank
/// staff, officers and admins who do not have a Farmer row.
model AuditLog {
  id        String   @id @default(cuid())
  actorId   String
  actorRole Role
  entity    String
  entityId  String
  action    String
  timestamp DateTime @default(now())
  metadata  Json?

  @@index([entity, entityId])
  @@index([actorId, timestamp])
  @@map("audit_logs")
}
```

---

## 8. Migration plan

### 8.1 Phased rollout

| Phase | Action |
|---|---|
| 1 — Preserve MVP | Keep the current `insurance` table readable; no breaking changes yet. |
| 2 — Introduce Farm | Create `Farm`; migrate current land/location fields off `Farmer` into one `Farm` row per farmer (their only farm so far). |
| 3 — Attach Crop to Farm | Add `Crop.farmId`; backfill from the migrated `Farm`; drop the old implicit farmer-linkage once verified. |
| 4 — Introduce financial relations | Create `Bank`, `FarmerBankAccount`, `Loan`, `LoanPayment`; backfill one `Loan` per farmer from `Farmer.loanAmount/loanDueDate` where present; populate `Farmer.legacyLoanAmount/legacyLoanDueDate` as read-only mirrors. |
| 5 — Introduce scheme system | Create `BankScheme`, `FarmerSchemeApplication`. No data migration needed — new feature. |
| 6 — Introduce insurance applications | Create `InsuranceApplication`; map every legacy `insurance` row per §8.2. Legacy table becomes read-only for new writes. |
| 7 — Future policy/claim system | Create `InsurancePolicy`, `InsuranceClaim`, `ClaimAssessment`, `Document`. Ship schema ahead of the workflow that uses it. |

Each phase is a separate, independently deployable migration — do not combine phases 2–4 into one migration, since Farm and financial data have unrelated rollback risk.

### 8.2 Legacy insurance status mapping

```
legacy insurance.status = not_registered  →  no active InsuranceApplication row
legacy insurance.status = pending         →  InsuranceApplication.status = pending
legacy insurance.status = approved        →  InsuranceApplication.status = approved
```

Do **not** auto-create an `InsurancePolicy` from a legacy `approved` row unless real policy data (number, coverage, premium, dates) actually exists. An `approved` application without a policy is a valid, expected state during migration.

### 8.3 Deprecated-field handling

`Farmer.loanAmount` / `Farmer.loanDueDate` become `[DERIVED FIELD]` (`legacyLoanAmount`/`legacyLoanDueDate`), recomputed nightly (or on loan write) as the values from the farmer's single most-recent active `Loan`. They are removed entirely once the frontend confirms it reads loan data from `/api/loans` instead of `/api/profile`.

---

## 9. API specification

### 9.1 Profile

```
GET  /api/profile
PUT  /api/profile
```

### 9.2 Farms

```
GET  /api/farms
POST /api/farms
GET  /api/farms/:id
PUT  /api/farms/:id
```

### 9.3 Crops

```
GET  /api/farms/:farmId/crops
POST /api/farms/:farmId/crops
PUT  /api/crops/:id
```

### 9.4 Risk

```
GET /api/farms/:farmId/risk
GET /api/farms/:farmId/risk/history
GET /api/farms/:farmId/risk/explanation
GET /api/profile/risk-summary
```

### 9.5 Banks & schemes

```
GET /api/banks
GET /api/banks/:id
GET /api/bank-schemes
GET /api/bank-schemes/:id
GET /api/banks/:bankId/schemes
GET /api/bank-schemes/eligible?farmId=&cropId=&season=   ← [NEW] server-computed eligibility
```

### 9.6 Bank accounts

```
GET  /api/bank-accounts
POST /api/bank-accounts
```

### 9.7 Loans

```
GET /api/loans
GET /api/loans/:id
GET /api/loans/:loanId/payments
```

### 9.8 Insurance

```
GET  /api/insurance                          (legacy-compatible read)
GET  /api/profile/insurance-summary

POST /api/insurance/applications
GET  /api/insurance/applications
GET  /api/insurance/applications/:id          ← [NEW] single-application fetch
PUT  /api/insurance/applications/:id
GET  /api/insurance/applications/:id/timeline ← [NEW] reconstructed server-side, not from frontend state
```

### 9.9 Claims (future)

```
POST /api/insurance/claims
GET  /api/insurance/claims
GET  /api/insurance/claims/:id
GET  /api/insurance/claims/:id/timeline
```

### 9.10 Notifications

```
GET /api/profile/notifications
PUT /api/notifications/:id/read
```

### 9.11 Why these three additions

| Addition | Reason |
|---|---|
| `GET /api/insurance/applications/:id` | Status/timeline screens shouldn't have to download every application to show one. |
| `GET /api/bank-schemes/eligible` | Eligibility depends on farm/crop/season context and must be computed server-side, not guessed by the frontend. |
| `GET /api/insurance/applications/:id/timeline` | Application history must come from persisted audit events, not reconstructed frontend state. |

---

## 10. Request/response JSON

### 10.1 `GET /api/profile`

```json
{
  "farmer": {
    "id": "farmer_123",
    "name": "Ramesh",
    "phoneMasked": "******1234",
    "village": "Example Village",
    "district": "Mayurbhanj",
    "state": "Odisha",
    "language": "OR",
    "status": "ACTIVE"
  },
  "farms": [
    {
      "id": "farm_01",
      "label": "Farm 01",
      "area": 2.5,
      "village": "Example Village",
      "district": "Mayurbhanj",
      "state": "Odisha",
      "location": { "latitude": null, "longitude": null },
      "currentCrop": {
        "id": "crop_01",
        "name": "Paddy",
        "season": "Kharif",
        "stage": "VEGETATIVE"
      }
    }
  ]
}
```

### 10.2 `PUT /api/profile`

Request:

```json
{
  "name": "Ramesh Kumar",
  "language": "HI"
}
```

Response `200`:

```json
{ "updated": true, "farmer": { "id": "farmer_123", "name": "Ramesh Kumar", "language": "HI" } }
```

Response `422` (attempting to edit a read-only field):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'district' requires verification and cannot be edited directly.",
    "field": "district"
  }
}
```

### 10.3 `POST /api/farms`

Request:

```json
{
  "label": "North Plot",
  "area": 1.8,
  "village": "Example Village",
  "district": "Mayurbhanj",
  "state": "Odisha",
  "latitude": 21.9287,
  "longitude": 86.7378
}
```

Response `201`:

```json
{ "id": "farm_02", "label": "North Plot", "area": 1.8, "status": "ACTIVE", "createdAt": "2026-08-29T10:00:00Z" }
```

### 10.4 `POST /api/bank-accounts`

Request:

```json
{
  "bankId": "bank_a",
  "accountNumber": "300456781234",
  "accountType": "SAVINGS"
}
```

Response `201` (never echoes the full number back):

```json
{
  "id": "acct_01",
  "bankId": "bank_a",
  "accountNumberMasked": "XXXXXX1234",
  "accountType": "SAVINGS",
  "status": "PENDING_VERIFICATION"
}
```

### 10.5 `POST /api/insurance/applications`

Request:

```json
{
  "farmId": "farm_01",
  "cropId": "crop_01",
  "bankSchemeId": "scheme_a1"
}
```

Response `201`:

```json
{
  "id": "app_01",
  "applicationNumber": "SC-INS-2026-000101",
  "status": "PENDING",
  "submittedAt": "2026-08-29T10:05:00Z"
}
```

Response `409` (duplicate active application):

```json
{
  "error": {
    "code": "APPLICATION_CONFLICT",
    "message": "An active application already exists for this farm, crop, and scheme."
  }
}
```

### 10.6 `GET /api/profile/insurance-summary`

```json
{
  "status": "not_registered",
  "currentInsurance": null,
  "riskContext": {
    "available": true,
    "farmId": "farm_01",
    "cropId": "crop_01",
    "score": 81,
    "reasons": ["Rainfall below normal", "Soil moisture low"]
  },
  "schemes": [
    { "bankId": "bank_a", "bankName": "Demo Bank A", "schemeId": "scheme_a1", "schemeName": "Demo Crop Protection", "status": "potentially_eligible" }
  ],
  "applications": []
}
```

### 10.7 Error envelope (see §19 for full code list)

```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "The requested resource was not found." } }
```

---

## 11. Validation

All validation is Zod, enforced at the Route Handler boundary — never trust a value that hasn't passed a schema.

| Entity | Rules |
|---|---|
| Profile update | `name`: 2–80 chars; `phone`: E.164-ish pattern, triggers re-verification if changed; `language`: enum only; `village/district`: non-empty strings, flagged for verification per §6/§12 rules |
| Farm | `label`: 1–60 chars; `area`: > 0; `latitude`: −90..90; `longitude`: −180..180; location fields required together |
| Crop | `name`, `season`: required; `sowingDate`: not in the future; `expectedHarvestDate` (if present): after `sowingDate` |
| Bank account | `bankId`: must exist; `accountNumber`: numeric, 9–18 digits; `accountType`: enum; ownership + duplicate constraint enforced at the DB layer (§6.6) |
| Insurance application | requester is authenticated; `farmId` belongs to requester; `cropId` belongs to `farmId`; `bankSchemeId` exists and `availabilityStatus = ACTIVE`; no conflicting active application for the same `(farmerId, farmId, cropId, bankSchemeId)` |

`farmerId` is never accepted from the request body — it is always resolved server-side from the authenticated session (§13).

---

## 12. Authorization

### 12.1 Roles

```
FARMER · BANK · INSURER · AGRICULTURE_OFFICER · GOVERNMENT · ADMIN
```

The role is resolved server-side from the authenticated session. Never trust `req.body.role`, a query-string role, or any client-supplied role claim.

### 12.2 Farmer authorization matrix

| Resource | Read | Create | Update | Approve |
|---|---:|---:|---:|---:|
| Own profile | Yes | No | Editable fields only | No |
| Own farm | Yes | Yes | Yes | No |
| Own crop | Yes | Yes | Yes | No |
| Own risk score | Yes | No | No | No |
| Own bank account | Yes, masked | Yes | Restricted (status is system-controlled) | No |
| Own loan | Yes, permitted fields | No | No | No |
| Own loan payments | Yes | No | No | No |
| Own insurance / applications | Yes | Application only | Own application fields (pre-submit) | No |
| Own policy / claim | Yes | Claim: future | Limited | No |
| Notifications | Yes | No | Mark read | No |

### 12.3 Non-farmer roles

- **Bank** — reads applications tied to its own `bankId`; can update authorized review states; cannot see other banks' data.
- **Insurer** — reviews insurance applications, manages policy/claim workflow, approves/rejects claims assigned to it.
- **Agriculture Officer** — operational data only for intervention purposes; never sees account numbers or full financial detail.
- **Government** — only whatever is explicitly exposed for program reporting.
- **Admin** — full but audited access; every admin action writes an `AuditLog` row.

### 12.4 Editable-field classification

| Field | Class |
|---|---|
| Name | Editable, validated |
| Phone | Editable, requires OTP re-verification |
| Language | Editable |
| Village | Editable/verification depending on deployment |
| District | Controlled/validated |
| Land area | Farm-level, not a profile field |
| Crop | Farm/crop flow, not a profile field |
| Risk score | System-generated, read-only |
| Loan amount / due date | Bank/system data, read-only to farmer |
| Insurance status | Bank/insurer workflow, read-only to farmer |

---

## 13. Ownership checks (IDOR protection)

Every resource lookup performs an ownership + role check. Never resolve a resource directly from a client-supplied ID:

```ts
// WRONG — trusts the client
const farmer = await prisma.farmer.findUnique({ where: { id: req.query.farmerId } })
```

Correct flow:

```
Authenticated Supabase session
        ↓
Resolve server-side Farmer via authUserId (never via a client-supplied farmerId)
        ↓
Check requested resource belongs to that Farmer (or requester's role permits it)
        ↓
Check role permission for the specific action
        ↓
Return only permitted data
```

A frontend-submitted `farmerId` is never treated as proof of ownership — it is, at most, ignored in favor of the session-resolved value.

---

## 14. Financial-data security

**Sensitive fields:** account number, loan amount, outstanding amount, interest rate, due date, payment history.

**Requirements:**
- `accountNumberEnc` is encrypted at rest (envelope encryption, app-managed key, not stored alongside the ciphertext).
- API responses only ever return `accountNumberMasked` (built from `accountNumberLast4`), never `accountNumberEnc` or a decrypted number, in any farmer-facing endpoint.
- Bank/Admin-only internal tooling that needs the full number goes through a separate, heavily audited decrypt path — not the general API.
- Every sensitive-field change writes an `AuditLog` row (§15).
- Secrets and full account numbers are never written to logs, including error logs and `AuditLog.metadata`.
- Rate limiting (Upstash Redis) on bank-account and loan endpoints to blunt enumeration attempts.

---

## 15. Audit logging

Minimum audited actions:

```
PROFILE_UPDATED
BANK_ACCOUNT_ADDED
BANK_ACCOUNT_UPDATED
INSURANCE_APPLICATION_CREATED
INSURANCE_APPLICATION_UPDATED
INSURANCE_APPLICATION_APPROVED
INSURANCE_APPLICATION_REJECTED
POLICY_CREATED
CLAIM_CREATED
CLAIM_UPDATED
DOCUMENT_UPLOADED
DOCUMENT_STATUS_CHANGED
```

Each `AuditLog` row records `actorId, actorRole, entity, entityId, action, timestamp`, and `metadata` limited to safe, non-sensitive context (e.g. `{ "changedFields": ["language"] }`, never a raw account number or full loan amount if that value itself is the sensitive part being changed — record that a change happened, not always the value).

---

## 16. Risk integration

Risk must always identify **farmer + farm + crop** — never just a farmer-level number.

```
Farmer → Farm → Crop → RiskScore   (agricultural signal)
Farmer → Loan → due-date proximity → Financial Risk → Overall Risk   (financial signal)
```

Core signals: rainfall deviation, market price drop, loan due-date proximity. `RiskScore` rows are append-only and indexed by `(farmId, createdAt)` / `(cropId, createdAt)` so history is always retrievable — a new score is never an update-in-place. The Farmer Profile backend's job is only to supply reliable, correctly-scoped `Farm`/`Crop`/`Loan` data to whatever service computes the score; this PRD does not define the scoring algorithm itself.

---

## 17. Insurance integration

### 17.1 Current MVP compatibility

The legacy `insurance` table (`id, farmer_id, crop, status`) keeps working through Phase 6 of the migration (§8). It has no policy number, provider, premium, coverage, or claim fields — do not assume those exist until `InsurancePolicy`/`InsuranceClaim` are actually populated.

### 17.2 Target chain

```
Farmer → Farm → Crop → InsuranceApplication → InsurancePolicy → InsuranceClaim → ClaimAssessment
```

Insurance is never a column on `Farmer`.

### 17.3 Workflow

```
Not Registered → Eligibility Check → Eligible → Application Started → Pending
   → Approved → Policy Active
```

Branch:

```
Pending → Action Required → Documents/Information Updated → Pending
```

Claim workflow (future):

```
Policy Active → Incident → Claim Submitted → Assessment → Approved/Rejected → Settlement
```

### 17.4 Hard rule: risk ≠ claim

Never implement:

```
Risk score > threshold  →  Automatic claim
```

Correct chain:

```
Crop Risk → Risk Alert/Evidence → Insurance Eligibility → Available Scheme
   → Farmer Application → Bank/Insurer Review → Approval → Policy
   → Claim only after an actual eligible incident
```

Risk is evidence and alerting; a claim is always a formal, human-reviewed workflow.

### 17.5 Scheme eligibility engine contract

Given farmer location, crop, farm area, season, farmer category, and existing bank relationship, the backend returns:

```json
{
  "schemeId": "scheme_123",
  "eligible": true,
  "status": "potentially_eligible",
  "reasons": ["Crop matches", "Location matches", "Season matches"],
  "missingInformation": []
}
```

`eligible: true` here is an internal pre-screen, never represented as official government/bank approval — the application is still subject to bank/insurer review.

### 17.6 Transaction boundary — application submission

```
Validate auth → Validate ownership → Validate farm/crop → Validate scheme availability
   → Validate required information → Create application → Write audit event
   → Create notification → Commit
```

If any step fails, the whole transaction rolls back — no partial application record.

---

## 18. Notification integration

`Notification` rows always belong to exactly one farmer, set server-side (never client-supplied). Categories: `WEATHER, RISK, MARKET, FARMING_REMINDER, OFFICER_UPDATE` plus insurance-specific `INSURANCE_APPLICATION, INSURANCE_ACTION_REQUIRED, INSURANCE_APPROVED, INSURANCE_REJECTED`.

Triggers:

```
Insurance application created        → notify farmer (+ optional bank/insurer queue)
Insurance application action_required → notify farmer
Insurance application/policy approved → notify farmer
```

---

## 19. Error handling

Consistent envelope on every error response:

```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "The requested resource was not found." } }
```

Recommended codes:

```
UNAUTHORIZED · FORBIDDEN · VALIDATION_ERROR · RESOURCE_NOT_FOUND · OWNERSHIP_ERROR
SCHEME_UNAVAILABLE · INELIGIBLE · MISSING_INFORMATION · APPLICATION_CONFLICT
RATE_LIMITED · STORAGE_ERROR · INTERNAL_ERROR
```

Never leak database internals (constraint names, stack traces, raw Prisma errors) in the response body — log them server-side, return the mapped code.

---

## 20. Edge cases

| Case | Handling |
|---|---|
| Farmer has zero farms | `/api/profile` returns `farms: []`; frontend shows the "no farm added yet" empty state (per companion frontend PRD §18) — not an error. |
| Farm has zero crops | `/api/farms/:id` returns `currentCrop: null`; downstream risk calls are simply not made for that farm until a crop exists. |
| Loan fully paid (`outstandingAmount = 0`) but `status` still `ACTIVE` | A scheduled job (or the payment write path) transitions `status → CLOSED` when `outstandingAmount` reaches 0; never inferred purely from the amount at read time. |
| Duplicate bank-account submission | Caught by the `(farmerId, bankId, accountNumberLast4)` unique constraint → `409 APPLICATION_CONFLICT`-style error. |
| Application submitted for a scheme that's since gone `PAUSED`/`CLOSED` | Validation rejects with `SCHEME_UNAVAILABLE` before any row is created. |
| Double-submit from a repeated button press | Idempotency key (Upstash Redis) on the insurance-application and bank-account POST routes; second request with the same key returns the first result, not a duplicate row. |
| Farmer attempts to edit a read-only field (e.g. `district`, loan amount) | `422 VALIDATION_ERROR` naming the field; no partial update is applied. |
| Phone changed mid-edit, OTP not yet confirmed | `phoneVerifiedAt` is cleared on submit; the new phone is provisional until OTP confirms it — profile reads show the old, verified phone until then. |
| Farmer soft-deleted, but has historical loans/crops/risk scores | Records remain untouched and queryable by role-authorized users (bank, admin); the farmer's own login is simply deactivated. See §24. |
| Attempt to move a `Crop` to a different `Farm` | Not supported by design — create a new `Crop` row on the target farm instead, preserving the old row as history. |
| Two `RiskScore` rows land on the same day for the same crop | Both are kept; consumers read the latest by `createdAt`, not a unique-per-day constraint — the scoring service may legitimately re-run. |
| Loan due-date proximity crossing a timezone/day boundary | All date comparisons for risk purposes use UTC server time consistently; do not compute "days remaining" client-side. |
| Rounding mismatch between `amountPaid` sum and `Loan.outstandingAmount` | `outstandingAmount` is the source of truth, set explicitly on each `LoanPayment` write (not derived by summing payments at read time), to avoid floating-point drift. |
| Two different farmers legitimately share the same last-4 account digits | Fine — masking is per-display, not a uniqueness guarantee; the uniqueness constraint is scoped to `(farmerId, bankId, accountNumberLast4)`, not globally. |
| Insurance application references a crop that's since been `ARCHIVED` | The application itself is unaffected (historical reference); new applications against an archived crop are blocked at validation. |

---

## 21. Seed data

Minimal seed set to bootstrap a working demo. Suggested `prisma/seed.ts` shape:

```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const bank = await prisma.bank.create({
    data: {
      bankName: 'Demo Bank A',
      branchName: 'Mayurbhanj Branch',
      ifscCode: 'DEMO0001234',
      district: 'Mayurbhanj',
      village: 'Example Village',
    },
  })

  const scheme = await prisma.bankScheme.create({
    data: {
      bankId: bank.id,
      schemeName: 'Demo Crop Protection',
      description: 'Baseline Kharif paddy protection scheme.',
      cropsCovered: ['Paddy'],
      eligibleLocations: ['Mayurbhanj'],
      eligibleSeasons: ['Kharif'],
      eligibilityRules: { minArea: 0.5 },
      coverageAmount: 50000,
      premium: 1200,
      subsidy: 600,
      policyPeriodMonths: 6,
      requiredDocuments: ['land_record', 'sowing_certificate'],
    },
  })

  const farmer = await prisma.farmer.create({
    data: {
      authUserId: 'seed-auth-uid-1',
      name: 'Ramesh',
      phone: '9000000001',
      village: 'Example Village',
      district: 'Mayurbhanj',
      state: 'Odisha',
      language: 'OR',
    },
  })

  const farm = await prisma.farm.create({
    data: {
      farmerId: farmer.id,
      label: 'Farm 01',
      area: 2.5,
      village: 'Example Village',
      district: 'Mayurbhanj',
      state: 'Odisha',
    },
  })

  const crop = await prisma.crop.create({
    data: {
      farmId: farm.id,
      name: 'Paddy',
      season: 'Kharif',
      sowingDate: new Date('2026-06-15'),
      stage: 'VEGETATIVE',
      area: 2.0,
    },
  })

  await prisma.riskScore.create({
    data: {
      farmerId: farmer.id,
      farmId: farm.id,
      cropId: crop.id,
      score: 81,
      rainfallRisk: 70,
      marketRisk: 40,
      loanRisk: 30,
      reasons: ['Rainfall below normal', 'Soil moisture low'],
    },
  })

  const loanBank = bank
  const loan = await prisma.loan.create({
    data: {
      farmerId: farmer.id,
      bankId: loanBank.id,
      loanType: 'Crop Loan',
      loanAmount: 40000,
      outstandingAmount: 25000,
      interestRate: 7.0,
      sanctionDate: new Date('2026-04-01'),
      dueDate: new Date('2026-12-01'),
    },
  })

  await prisma.loanPayment.create({
    data: {
      loanId: loan.id,
      amountPaid: 15000,
      paymentDate: new Date('2026-07-01'),
      remainingAmount: 25000,
    },
  })

  // legacy-compatible insurance row, demonstrating migration coexistence
  await prisma.insurance.create({
    data: { farmerId: farmer.id, crop: 'Paddy', status: 'NOT_REGISTERED' },
  })

  console.log({ bank: bank.id, scheme: scheme.id, farmer: farmer.id, farm: farm.id, crop: crop.id, loan: loan.id })
}

main().finally(() => prisma.$disconnect())
```

This gives every endpoint in §9 something real to return on first run, without needing production data.

---

## 22. Testing plan

### 22.1 Unit tests
- Profile field validation (editable vs. read-only vs. verification-required)
- Farm ownership resolution
- Crop ownership resolution (via farm → farmer)
- Bank-account masking function (`accountNumberLast4` → `XXXXXX1234`)
- Scheme eligibility evaluation against a fixture `BankScheme`
- `InsuranceApplication` status-transition guard (no illegal jumps, e.g. `pending → policy_active` without `approved`)

### 22.2 Integration tests
- `GET /api/profile` returns correct farmer + farms + current crop shape
- `PUT /api/profile` rejects a read-only field, accepts an editable one
- `POST /api/farms` → `GET /api/farms/:id` round-trip
- `POST /api/farms/:farmId/crops` correctly scopes crop to farm
- `POST /api/bank-accounts` returns masked number only
- `GET /api/loans` / `GET /api/loans/:loanId/payments` return correctly scoped data
- `GET /api/bank-schemes/eligible?farmId=&cropId=` returns a computed, not hardcoded, result
- `POST /api/insurance/applications` full happy path + duplicate-conflict path
- `GET /api/insurance/applications/:id/timeline` reflects actual audit events

### 22.3 Security tests
- Farmer A cannot read or write Farmer B's profile, farms, crops, loans, or applications
- Farmer cannot override `farmerId` in a request body to impersonate another farmer
- Farmer cannot modify `RiskScore`, `Loan.outstandingAmount`, `FarmerBankAccount.status`, or any `InsuranceApplication.status`
- Bank role cannot access an unrelated bank's applications
- Full/unmasked account number is never present in any ordinary farmer-facing response body
- Every `PROFILE_UPDATED`/`BANK_ACCOUNT_ADDED`/insurance-status-change action produces exactly one `AuditLog` row

---

## 23. Acceptance criteria

**Farmer Profile**
- [ ] A farmer can have more than one `Farm`, each with its own identity and location
- [ ] A `Crop` always belongs to exactly one `Farm`, never directly to `Farmer`
- [ ] Crop history is retained as separate rows, never overwritten in place
- [ ] Every `RiskScore` row identifies `farmerId + farmId + cropId`, and history is queryable
- [ ] Financial data lives in `Loan`/`LoanPayment`/`FarmerBankAccount`, not as bare fields on `Farmer`
- [ ] A farmer can have multiple loans and multiple bank accounts
- [ ] Account numbers are encrypted at rest and only ever returned masked
- [ ] All profile endpoints resolve identity server-side from the session — never from a client-supplied `farmerId`
- [ ] Editing a read-only or verification-required field is rejected with a clear error, not silently ignored or silently applied
- [ ] Every sensitive profile/financial change produces an `AuditLog` row
- [ ] Notifications are always correctly scoped to the owning farmer

**Insurance**
- [ ] The legacy `insurance` table keeps working, unmodified, through migration Phase 6
- [ ] `InsuranceApplication` always references `farmerId + farmId + cropId`, never lives as a `Farmer` column
- [ ] Multiple banks and multiple schemes per bank are supported
- [ ] Scheme definitions (`BankScheme`) are separate from farmer applications (`InsuranceApplication`)
- [ ] Eligibility is computed server-side via `/api/bank-schemes/eligible`, never assumed client-side
- [ ] A high `RiskScore` never auto-creates an `InsuranceApplication` or a claim
- [ ] `InsurancePolicy` is only created from a genuinely approved application with real policy data
- [ ] `InsuranceClaim` always references a `InsurancePolicy`, never created standalone
- [ ] Application approval/rejection is restricted to `BANK`/`INSURER`/`ADMIN` roles
- [ ] Documents are stored in Supabase Storage with metadata-only rows in Postgres, authorization-checked before any download URL is issued

---

## 24. Definition of Done

**Farmer Profile**
- [ ] Farmer/Farm/Crop are separate, correctly-related entities
- [ ] Multiple farms work end-to-end (create, list, view, update)
- [ ] Crops belong to farms; crop history can be retained across seasons
- [ ] Farm location is persisted and returned
- [ ] Risk identifies farmer + farm + crop; risk history is retained
- [ ] Financial data is normalized into bank/loan relationships
- [ ] Account numbers are encrypted and masked in every response
- [ ] Ownership is enforced server-side on every route, not just in the UI
- [ ] Profile updates are validated per §11 and audited per §15
- [ ] Notifications belong to the correct farmer
- [ ] Soft deletion preserves all historical relationships (§8, §20)

**Insurance**
- [ ] Existing insurance table remains compatible through migration
- [ ] Insurance references farm/crop, never lives directly on `Farmer`
- [ ] Multiple banks and multiple schemes per bank are supported
- [ ] Scheme definitions are separate from applications
- [ ] Eligibility is evaluated server-side
- [ ] Application status is persisted and transitions follow the workflow in §17.3
- [ ] Approval is role-controlled (`BANK`/`INSURER`/`ADMIN` only)
- [ ] Policy is a separate entity from claim; claim is never auto-generated from risk
- [ ] Documents are securely stored with authorization-checked access
- [ ] Every insurance-workflow action is audited
- [ ] A farmer only ever sees their own records

---

## Appendix — Final architecture

```
                         SMART CROP

Farmer
 │
 ├── Profile
 │
 ├── Farms
 │     └── Crops
 │           └── Risk
 │
 ├── Bank Accounts ─── Bank
 │
 ├── Loans ─────────── Bank
 │     └── Payments
 │
 ├── Insurance Applications
 │     └── Bank Scheme
 │
 ├── Insurance Policy
 │     └── Claims
 │           └── Assessment
 │
 ├── Notifications
 │
 └── Audit Logs
```

**Design principle:** Farmer data is the foundation. Farms and crops provide agricultural context. Risk is an independent prediction system fed by that context. Insurance is an intervention workflow, never a shortcut from risk. Bank schemes are reusable definitions; applications are farmer actions against them; policies and claims are separate, future lifecycle entities that only exist once real approval has happened.
