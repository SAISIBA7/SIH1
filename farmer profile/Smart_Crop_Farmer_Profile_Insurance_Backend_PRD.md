# Smart Crop — Farmer Profile & Insurance
## Backend Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Implementation-ready / Hackathon Build  
**Scope:** Backend for Farmer Profile + Farmer Insurance workflows

---

# 1. Objective

Build the backend foundation for the Farmer Profile and Insurance pages while preserving Smart Crop's existing product loop:

`MONITOR → DETECT → PREDICT → EXPLAIN → INTERVENE → PREVENT`

The backend must separate:

```text
Farmer
  └── Farm / Plot
       └── Crop
            └── Risk

Farmer
  ├── Bank Accounts
  ├── Loans
  │    └── Loan Payments
  ├── Insurance
  ├── Notifications
  └── Interventions
```

The existing backend specifications explicitly require farmer/farm/crop separation, multiple farms, farm-specific risk, multiple bank relationships, multiple loans/accounts, insurance separation, strict authorization and auditability. fileciteturn1file6L1125-L1156

---

# 2. Technology

Use the existing Smart Crop stack:

- Next.js 14+ App Router
- TypeScript
- Route Handlers
- Prisma
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Upstash Redis
- Zod

The project's complete backend PRD defines this stack. fileciteturn1file6L1031-L1047

---

# 3. Scope

## In scope

### Farmer Profile
- Farmer record
- Personal information
- Farm/plot records
- Crop records/history
- Farm location
- Risk linkage
- Financial linkage
- Bank accounts
- Loans
- Loan payments
- Notifications
- Profile update audit

### Insurance
- Existing insurance compatibility
- Insurance linked to farmer/farm/crop
- Bank catalogue
- Bank schemes
- Farmer scheme applications
- Insurance applications
- Future insurance policies
- Future claims
- Documents
- Approval/review workflow
- Audit trail

## Out of scope
- Full crop-monitoring backend
- Weather ingestion
- Mandi ingestion
- Full ML service
- Bank core-banking integration
- Real insurer integration
- Payment settlement infrastructure
- Government verification integration

---

# 4. Existing Data vs New Data

## 4.1 Existing Insurance table

Current:

```text
insurance
----------
id
farmer_id
crop
status
```

Current statuses:

```text
not_registered
pending
approved
```

Do not assume the current table has:
- policy number
- provider
- premium
- coverage
- claim
- assessment
- settlement
- policy dates

The project documentation explicitly says these are future enhancements. fileciteturn2file3L507-L539

## 4.2 Planned bank tables

The supplied baseline is:

```text
banks
----------
bank_id
bank_name
branch_name
ifsc_code
district
village

farmer_bank_accounts
--------------------
account_id
farmer_id
bank_id
account_number
account_type
status

loans
----------
loan_id
farmer_id
bank_id
loan_type
loan_amount
outstanding_amount
interest_rate
sanction_date
due_date
status

loan_payments
-------------
payment_id
loan_id
amount_paid
payment_date
remaining_amount
```

These are planned/being created and should be treated as the baseline. fileciteturn2file6L1192-L1238

---

# 5. Proposed Entity Model

```text
Farmer
  │
  ├──< Farm
  │      └──< Crop
  │             └──< RiskScore
  │
  ├──< FarmerBankAccount >── Bank
  │
  ├──< Loan >── Bank
  │       └──< LoanPayment
  │
  ├──< InsuranceApplication
  │       └── BankScheme
  │
  ├──< InsurancePolicy
  │       └──< InsuranceClaim
  │              └──< ClaimAssessment
  │
  ├──< Notification
  ├──< Intervention
  └──< AuditLog

Bank
  └──< BankScheme
```

The architecture should not put every domain field on `Farmer`.

---

# 6. Database Status Classification

| Entity | Status | Purpose |
|---|---|---|
| Farmer | Existing / Modified | Personal profile |
| Farm | New | Plot/farm identity |
| Crop | Existing concept / Modified | Farm-owned seasonal crop |
| RiskScore | Existing concept / Modified | Farm/crop-specific risk |
| Bank | Planned/New | Bank + branch |
| FarmerBankAccount | Planned/New | Farmer-bank relationship |
| Loan | Planned/New | Financial liability |
| LoanPayment | Planned/New | Payment history |
| BankScheme | New | Scheme definition |
| FarmerSchemeApplication | New | Scheme application |
| Insurance | Existing / Modified | MVP compatibility |
| InsuranceApplication | New | Application workflow |
| InsurancePolicy | New/Future | Approved policy |
| InsuranceClaim | New/Future | Formal claim |
| ClaimAssessment | New/Future | Claim assessment |
| Document | New | Secure document metadata |
| Notification | Existing/New | Farmer notifications |
| Intervention | Existing/New | Officer/action records |
| AuditLog | New | Sensitive action history |

The full backend project specification requires these major entities and explicitly says to mark existing, new and modified tables rather than blindly duplicating entities. fileciteturn3file1L329-L365

---

# 7. Farmer Model

Minimum conceptual fields:

```text
id
name
phone
district
village
state
language
createdAt
updatedAt
status
```

Do not use:

```text
landArea
loanAmount
loanDueDate
```

as the primary long-term architecture.

Those belong to farm and loan entities.

---

# 8. Farm Model

Recommended fields:

```text
id
farmerId
label
area
village
district
state
latitude
longitude
boundary
createdAt
updatedAt
status
```

### Required
- `id`
- `farmerId`
- `label`
- `area`
- location fields
- timestamps

### Optional
- GPS
- polygon/boundary
- soil reference

The source backend specification explicitly calls for farm label, area, village, district, state, latitude, longitude, optional polygon and timestamps. fileciteturn2file6L1270-L1291

---

# 9. Crop Model

Crop must belong to a Farm.

Recommended:

```text
id
farmId
name
season
sowingDate
expectedHarvestDate
stage
area
status
createdAt
updatedAt
```

Relationships:

```text
Farmer
 ↓
Farm
 ↓
Crop
```

Never make crop a permanent farmer field.

Support historical records by retaining crop rows instead of overwriting the previous season. fileciteturn2file6L1293-L1311

---

# 10. Risk Model

Risk must identify:

```text
farmer
farm
crop
```

Recommended:

```text
RiskScore
----------
id
farmerId
farmId
cropId
score
rainfallRisk
marketRisk
loanRisk
reasons
createdAt
```

Optional separate history table is acceptable if the project already has one.

Required relationship:

```text
Farmer
 ↓
Farm
 ↓
Crop
 ↓
RiskScore
```

Financial signal:

```text
Farmer
 ↓
Loan
 ↓
Due-date proximity
 ↓
Financial Risk
 ↓
Overall Risk
```

Core risk signals in the existing system include rainfall deviation, market price drop and loan due-date proximity. fileciteturn2file0L11-L39

Risk history must be retained.

---

# 11. Bank Model

Current planned bank fields:

```text
bankId
bankName
branchName
ifscCode
district
village
```

Recommended technical additions:

```text
createdAt
updatedAt
status
```

These additions support lifecycle management without changing the supplied business fields.

Uniqueness:
- `bankId` primary key.
- IFSC should be indexed and normally unique per branch where business rules permit.

---

# 12. Farmer Bank Account

Fields:

```text
accountId
farmerId
bankId
accountNumber
accountType
status
createdAt
updatedAt
```

Rules:
- Account belongs to one farmer.
- Account references a Bank.
- Full account number is sensitive.
- API responses should return a masked form.
- Example: `XXXXXX1234`.
- Duplicate account relationships must be prevented according to project rules.

The backend source explicitly requires encryption/tokenization strategy as needed, masking, authorization, validation and duplicate prevention. fileciteturn1file3L546-L565

---

# 13. Loan Model

Fields:

```text
loanId
farmerId
bankId
loanType
loanAmount
outstandingAmount
interestRate
sanctionDate
dueDate
status
createdAt
updatedAt
```

Relationship:

```text
Farmer
 ↓
Loan
 ↓
LoanPayment
```

A farmer can have multiple loans.

Do not retain `Farmer.loanAmount` and `Farmer.loanDueDate` as the primary financial architecture. They should be migrated to derived/legacy fields and eventually deprecated. fileciteturn2file0L499-L543

---

# 14. Loan Payment Model

Fields:

```text
paymentId
loanId
amountPaid
paymentDate
remainingAmount
createdAt
```

Rules:
- Payment belongs to exactly one loan.
- Loan belongs to exactly one farmer and bank.
- Payment history is append-oriented.
- Do not allow a farmer to directly edit payment history.

---

# 15. Bank Scheme Model

There are currently no bank-scheme tables.

Create:

```text
BankScheme
----------
id
bankId
schemeName
description
cropsCovered
eligibleLocations
eligibleSeasons
eligibilityRules
coverageAmount
premium
subsidy
policyPeriod
requiredDocuments
availabilityStatus
createdAt
updatedAt
```

Implementation note:
- `cropsCovered`, `eligibleLocations`, `eligibleSeasons`, `eligibilityRules` may be normalized child tables if querying becomes complex.
- For MVP, JSON/array columns are acceptable if Prisma/PostgreSQL constraints are defined carefully.
- Financial values must be nullable because not every scheme response will provide them.
- Do not store scheme definitions inside Farmer.

The intended architecture is explicitly:

```text
BANK
BANK_SCHEME
FARMER_SCHEME_APPLICATION
```

and one bank can have many schemes. fileciteturn3file0L12-L45

---

# 16. Farmer Scheme Application

Separate scheme definitions from farmer applications.

Recommended:

```text
id
farmerId
farmId
cropId
bankSchemeId
status
eligibilitySnapshot
submittedAt
reviewedAt
reviewedBy
rejectionReason
createdAt
updatedAt
```

Purpose:
- Records what the farmer applied for.
- Preserves the selected farm/crop context.
- Allows multiple applications.
- Preserves an eligibility snapshot so later scheme changes do not rewrite history.

---

# 17. Insurance MVP Architecture

Maintain compatibility with the current:

```text
insurance
----------
id
farmer_id
crop
status
```

But migrate toward:

```text
Farmer
 ↓
Farm
 ↓
Crop
 ↓
InsuranceApplication
 ↓
InsurancePolicy
 ↓
InsuranceClaim
 ↓
ClaimAssessment
```

Do not make insurance fields part of `Farmer`.

---

# 18. Insurance Application

Recommended future table:

```text
InsuranceApplication
--------------------
id
farmerId
farmId
cropId
bankSchemeId
status
applicationNumber
submittedAt
reviewedAt
reviewedBy
rejectionReason
createdAt
updatedAt
```

Status model:

```text
not_registered
eligible
application_started
pending
approved
rejected
action_required
policy_active
```

For current MVP, map legacy states:

```text
not_registered → NOT REGISTERED
pending        → PENDING
approved       → APPROVED
```

---

# 19. Insurance Policy

Future table:

```text
InsurancePolicy
---------------
id
applicationId
farmerId
farmId
cropId
providerId
bankId
policyNumber
coverageAmount
premium
subsidy
startDate
endDate
status
createdAt
updatedAt
```

Do not implement these as if they already exist in the current database.

The project specifically separates current MVP data from future policy data. fileciteturn3file0L48-L100

---

# 20. Insurance Claim

Future table:

```text
InsuranceClaim
--------------
id
policyId
incidentDate
submittedAt
description
status
claimedAmount
approvedAmount
createdAt
updatedAt
```

Possible status:

```text
submitted
under_assessment
approved
rejected
settled
```

A claim must always reference an insurance policy.

---

# 21. Claim Assessment

Future:

```text
ClaimAssessment
---------------
id
claimId
assessorId
assessmentDate
assessmentResult
damagePercentage
notes
status
createdAt
```

Assessment is separate from claim and policy.

---

# 22. Critical Risk/Insurance Rule

Never implement:

```text
Risk score > threshold
        ↓
Automatic claim
```

Correct:

```text
Crop Risk
 ↓
Risk Alert / Evidence
 ↓
Insurance Eligibility
 ↓
Available Scheme
 ↓
Farmer Application
 ↓
Bank/Insurer Review
 ↓
Approval
 ↓
Policy
 ↓
Claim only after eligible incident
```

The project explicitly states that risk is evidence/alerting and a claim is a formal workflow. fileciteturn3file0L103-L137

---

# 23. Insurance Documents

Use a generic document metadata model:

```text
Document
--------
id
ownerType
ownerId
documentType
storagePath
fileName
mimeType
fileSize
status
uploadedBy
createdAt
updatedAt
```

Possible status:

```text
uploaded
pending
verified
rejected
```

Actual file bytes should be stored in Supabase Storage, not PostgreSQL.

Authorization must be checked before generating any document download/access path.

---

# 24. Notifications

Recommended:

```text
Notification
------------
id
farmerId
type
title
message
isRead
createdAt
readAt
entityType
entityId
```

Supported profile categories:
- Weather
- Risk
- Market
- Farming Reminders
- Officer Updates

Insurance notifications can use:

```text
insurance_application
insurance_action_required
insurance_approved
insurance_rejected
```

---

# 25. Audit Log

Required for sensitive and role-controlled actions:

```text
AuditLog
--------
id
actorId
actorRole
entity
entityId
action
timestamp
metadata
```

Never store secrets or full account numbers in metadata.

The source backend specification requires auditability for sensitive changes and provides these fields. fileciteturn2file0L175-L195

---

# 26. API Design

## Profile

```http
GET /api/profile
PUT /api/profile
```

## Farms

```http
GET  /api/farms
POST /api/farms
GET  /api/farms/:id
PUT  /api/farms/:id
```

## Crops

```http
GET  /api/farms/:farmId/crops
POST /api/farms/:farmId/crops
PUT  /api/crops/:id
```

## Risk

```http
GET /api/farms/:farmId/risk
GET /api/farms/:farmId/risk/history
GET /api/farms/:farmId/risk/explanation
```

## Banks

```http
GET /api/banks
GET /api/banks/:id
```

## Bank schemes

```http
GET /api/bank-schemes
GET /api/bank-schemes/:id
GET /api/banks/:bankId/schemes
```

## Bank accounts

```http
GET  /api/bank-accounts
POST /api/bank-accounts
```

## Loans

```http
GET /api/loans
GET /api/loans/:id
GET /api/loans/:loanId/payments
```

## Insurance

```http
GET  /api/insurance
GET  /api/insurance/:id

POST /api/insurance/applications
GET  /api/insurance/applications
GET  /api/insurance/applications/:id
PUT  /api/insurance/applications/:id
```

## Claims — future

```http
POST /api/insurance/claims
GET  /api/insurance/claims
GET  /api/insurance/claims/:id
GET  /api/insurance/claims/:id/timeline
```

These routes are based on the project's existing backend API design. fileciteturn3file0L163-L239

---

# 27. Recommended API Improvements

## 27.1 Add application-specific GET

Add:

```http
GET /api/insurance/applications/:id
```

Reason: status/timeline pages need one application without downloading every application.

## 27.2 Add farmer-specific scheme endpoint

Add:

```http
GET /api/bank-schemes/eligible
```

Optional query:

```text
?farmId=
&cropId=
&season=
```

Reason: eligibility depends on farm/crop context and should be computed server-side.

## 27.3 Add application timeline endpoint

```http
GET /api/insurance/applications/:id/timeline
```

Reason: application history should not be reconstructed from unrelated frontend state.

---

# 28. Request Validation

Use Zod on Route Handler boundaries.

## Profile
Validate:
- Name
- Phone
- Village
- District
- State
- Language

## Farm
Validate:
- Label
- Area > 0
- Location consistency
- Latitude [-90, 90]
- Longitude [-180, 180]

## Bank account
Validate:
- Bank exists
- Account number format
- Account type
- Ownership
- Duplicate constraints

## Insurance application
Validate:
- Farmer is authenticated
- Farm belongs to farmer
- Crop belongs to selected farm
- Scheme exists
- Scheme is available
- Required application fields exist

Never trust frontend `farmerId`.

---

# 29. Authorization

Supported roles:

```text
FARMER
BANK
INSURER
AGRICULTURE_OFFICER
GOVERNMENT
ADMIN
```

Backend determines role.

Never trust:
- `req.body.role`
- frontend role
- query-string role

The source backend PRD explicitly requires server-side role determination. fileciteturn3file0L140-L160

---

# 30. Farmer Authorization Matrix

| Resource | Farmer Read | Farmer Create | Farmer Update | Farmer Approve |
|---|---:|---:|---:|---:|
| Own Profile | Yes | No | Allowed fields | No |
| Own Farm | Yes | Yes | Allowed | No |
| Own Crop | Yes | Yes | Allowed | No |
| Own Risk | Yes | No | No | No |
| Own Bank Account | Yes, masked | Yes | Restricted | No |
| Own Loan | Yes, permitted fields | No | No | No |
| Own Payments | Yes | No | No | No |
| Own Insurance | Yes | Application only | Own application fields | No |
| Own Policy | Yes | No | No | No |
| Own Claim | Yes | Future | Limited | No |
| Notifications | Yes | No | Read state | No |

Official/system-generated fields cannot be modified by the farmer.

---

# 31. Bank/Insurer Permissions

## Bank
Can:
- Read relevant applications.
- Review relevant financial/application information.
- Update authorized application/review states.
- Perform authorized approval/rejection actions where applicable.

## Insurer
Can:
- Review insurance applications.
- Manage policy workflow.
- Manage claim assessment where assigned.
- Approve/reject authorized claim actions.

## Agriculture Officer
Can:
- Access only operational data needed for intervention.
- Not access unnecessary account numbers or sensitive financial details.

## Government
Can:
- Access only permitted program data.

## Admin
- Controlled system-level access.
- All sensitive actions audited.

---

# 32. IDOR Protection

Every resource lookup must perform ownership/role checks.

Bad:

```ts
const farmer = await prisma.farmer.findUnique({
  where: { id: req.query.farmerId }
})
```

Correct conceptual flow:

```text
Authenticated Supabase user
        ↓
Resolve server-side farmer identity
        ↓
Check requested resource ownership
        ↓
Check role permission
        ↓
Return permitted data
```

A frontend-submitted farmer ID is never proof of ownership.

---

# 33. Financial Security

Sensitive:
- Account number
- Loan amount
- Outstanding amount
- Interest rate
- Due date
- Payment history

Requirements:
- Encrypt/tokenize sensitive values where appropriate.
- Mask account numbers in normal API responses.
- Avoid unnecessary exposure.
- Audit sensitive changes.
- Never log secrets.

The backend project explicitly requires sensitive-field protection, account masking, secure documents, rate limiting and IDOR prevention. fileciteturn3file1L395-L413

---

# 34. Profile Update Rules

### Farmer editable
- Name
- Language
- Permitted contact/address fields

### Verification required
- Phone when changed
- Location when verification is required

### Farm-level
- Land area
- Farm location
- Crop

### System-generated
- Risk score
- Risk factors

### Bank/system controlled
- Loan outstanding amount
- Bank verification status

### Bank/insurer controlled
- Insurance approval status
- Policy status

These distinctions are required by the project backend specification. fileciteturn2file0L147-L172

---

# 35. Deletion Strategy

Use soft deletion/deactivation where historical relationships exist.

Do not hard-delete farmers whose records are referenced by:
- Loans
- Payments
- Crops
- Risk scores
- Insurance
- Claims
- Interventions

The source specification explicitly requires historical relationship preservation. fileciteturn2file0L198-L213

---

# 36. Insurance Workflow

```text
Not Registered
 ↓
Eligibility Check
 ↓
Eligible
 ↓
Application Started
 ↓
Pending
 ↓
Approved
 ↓
Policy Active
```

Possible action-required branch:

```text
Pending
 ↓
Action Required
 ↓
Documents/Information Updated
 ↓
Pending
```

Claim workflow:

```text
Policy Active
 ↓
Incident
 ↓
Claim Submitted
 ↓
Assessment
 ↓
Approved / Rejected
 ↓
Settlement
```

---

# 37. Bank Scheme Workflow

```text
Bank created
 ↓
Bank Scheme created
 ↓
Scheme eligibility configured
 ↓
Farmer profile/farm/crop evaluated
 ↓
Relevant schemes returned
 ↓
Farmer selects scheme
 ↓
Application created
 ↓
Bank/insurer review
 ↓
Approved / Rejected / Action Required
```

Scheme definition and farmer application must remain separate entities. fileciteturn3file0L12-L45

---

# 38. Scheme Eligibility Engine Contract

The backend should evaluate, where data is available:

```text
Farmer location
Crop
Farm area
Season
Farmer category
Existing bank relationship
Scheme availability
```

Return:

```json
{
  "schemeId": "scheme_123",
  "eligible": true,
  "status": "potentially_eligible",
  "reasons": [
    "Crop matches",
    "Location matches",
    "Season matches"
  ],
  "missingInformation": []
}
```

Important:
- `eligible: true` in the application's internal eligibility engine must not be represented as official government approval.
- The final application remains subject to bank/insurer workflow.

---

# 39. Profile API Response Shape

Example:

```json
{
  "farmer": {
    "id": "farmer_123",
    "name": "Ramesh",
    "phoneMasked": "******1234",
    "village": "Example Village",
    "district": "Mayurbhanj",
    "state": "Odisha",
    "language": "or"
  },
  "farms": [
    {
      "id": "farm_01",
      "label": "Farm 01",
      "area": 2.5,
      "village": "Example Village",
      "district": "Mayurbhanj",
      "state": "Odisha",
      "location": {
        "latitude": null,
        "longitude": null
      },
      "currentCrop": {
        "id": "crop_01",
        "name": "Paddy",
        "season": "Kharif",
        "stage": "Vegetative"
      }
    }
  ]
}
```

Do not include unnecessary financial/account secrets.

---

# 40. Insurance API Response Shape

Example:

```json
{
  "status": "not_registered",
  "currentInsurance": null,
  "riskContext": {
    "available": true,
    "farmId": "farm_01",
    "cropId": "crop_01",
    "score": 81,
    "reasons": [
      "Rainfall below normal",
      "Soil moisture low"
    ]
  },
  "schemes": [
    {
      "bankId": "bank_a",
      "bankName": "Demo Bank A",
      "schemeId": "scheme_a1",
      "schemeName": "Demo Crop Protection",
      "status": "potentially_eligible"
    }
  ],
  "applications": []
}
```

Use synthetic data only in demo mode.

---

# 41. Error Contract

Use consistent errors:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found."
  }
}
```

Recommended codes:

```text
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
RESOURCE_NOT_FOUND
OWNERSHIP_ERROR
SCHEME_UNAVAILABLE
INELIGIBLE
MISSING_INFORMATION
APPLICATION_CONFLICT
RATE_LIMITED
STORAGE_ERROR
INTERNAL_ERROR
```

Do not leak database internals.

---

# 42. Concurrency / Duplicate Protection

Prevent:
- Duplicate bank-account records where business identity says they are duplicates.
- Duplicate active application for the same farmer + farm + crop + scheme where prohibited.
- Conflicting status updates.
- Double submission from repeated button presses.

Use:
- Database unique constraints
- Transactions
- Idempotency where appropriate

---

# 43. Transaction Boundaries

Insurance application submission should be transactional:

```text
Validate auth
 ↓
Validate ownership
 ↓
Validate farm/crop
 ↓
Validate scheme availability
 ↓
Validate required information
 ↓
Create application
 ↓
Create initial audit event
 ↓
Create notification
 ↓
Commit
```

If any required operation fails, rollback the transaction.

---

# 44. Notifications

On insurance submission:

```text
Create application
→ notify farmer
→ optionally notify bank/insurer queue
```

On action required:

```text
Update application
→ notify farmer
```

On approval:

```text
Update application/policy
→ notify farmer
```

Notifications must always reference the correct farmer and relevant entity.

---

# 45. Audit Events

At minimum audit:

```text
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

For each:
- actor
- role
- entity
- entity ID
- action
- timestamp
- safe metadata

---

# 46. Prisma Design Guidance

Use explicit relations:

```text
Farmer 1 ── N Farm
Farm 1 ── N Crop
Crop 1 ── N RiskScore

Bank 1 ── N FarmerBankAccount
Farmer 1 ── N FarmerBankAccount

Bank 1 ── N Loan
Farmer 1 ── N Loan
Loan 1 ── N LoanPayment

Bank 1 ── N BankScheme
Farmer 1 ── N InsuranceApplication
BankScheme 1 ── N InsuranceApplication
Farm 1 ── N InsuranceApplication
Crop 1 ── N InsuranceApplication
```

Use foreign keys and indexes for:
- farmerId
- farmId
- cropId
- bankId
- bankSchemeId
- application status
- dates used for sorting/history

---

# 47. Migration Plan

## Phase 1 — Preserve MVP
Keep current insurance data readable.

## Phase 2 — Introduce Farm
Create Farm and migrate current land/location information where possible.

## Phase 3 — Attach Crop to Farm
Migrate current crop records to the correct farm.

## Phase 4 — Introduce financial relations
Create Bank, FarmerBankAccount, Loan and LoanPayment.

## Phase 5 — Introduce scheme system
Create BankScheme and FarmerSchemeApplication.

## Phase 6 — Introduce insurance applications
Create InsuranceApplication and map legacy insurance statuses.

## Phase 7 — Future policy/claim system
Create InsurancePolicy, InsuranceClaim, ClaimAssessment and document workflows.

---

# 48. Legacy Insurance Mapping

Example:

```text
legacy insurance.status = not_registered
→ no active application

legacy insurance.status = pending
→ InsuranceApplication.status = pending

legacy insurance.status = approved
→ InsuranceApplication.status = approved
```

Do not automatically create a policy from `approved` unless actual policy data exists.

---

# 49. Testing Requirements

## Unit tests
- Profile validation
- Farm ownership
- Crop ownership
- Bank-account masking
- Scheme eligibility
- Application status transitions

## Integration tests
- Farmer profile retrieval
- Profile update
- Farm creation
- Crop creation
- Bank account creation
- Loan retrieval
- Scheme listing
- Eligibility check
- Application submission
- Application status retrieval

## Security tests
- Farmer A cannot access Farmer B.
- Farmer cannot change farmerId to bypass ownership.
- Farmer cannot modify risk.
- Farmer cannot modify loan outstanding amount.
- Farmer cannot approve insurance.
- Bank cannot access unrelated farmer data.
- Full account number is never returned in ordinary farmer responses.

---

# 50. Definition of Done

## Farmer Profile
- [ ] Farmer/farm/crop are separate entities.
- [ ] Multiple farms work.
- [ ] Crops belong to farms.
- [ ] Crop history can be retained.
- [ ] Farm location is persisted.
- [ ] Risk identifies farmer + farm + crop.
- [ ] Risk history is retained.
- [ ] Financial data is normalized into bank/loan relationships.
- [ ] Account numbers are protected/masked.
- [ ] Farmer ownership is enforced server-side.
- [ ] Profile updates are validated.
- [ ] Sensitive changes are audited.
- [ ] Notifications belong to the correct farmer.

## Insurance
- [ ] Existing insurance table remains compatible during migration.
- [ ] Insurance can reference farm/crop.
- [ ] Multiple banks are supported.
- [ ] Multiple schemes per bank are supported.
- [ ] Scheme definitions are separate from applications.
- [ ] Eligibility is evaluated server-side.
- [ ] Application status is persisted.
- [ ] Approval is role-controlled.
- [ ] Policy is separate from claim.
- [ ] Claim is never generated automatically from risk.
- [ ] Documents are securely stored.
- [ ] Insurance actions are audited.
- [ ] Farmer sees only their own records.

---

# 51. Final Architecture

```text
                         SMART CROP

Farmer
 │
 ├────────────── Profile
 │
 ├────────────── Farms
 │                 │
 │                 └── Crops
 │                      │
 │                      └── Risk
 │
 ├────────────── Bank Accounts ─── Bank
 │
 ├────────────── Loans ─────────── Bank
 │                    │
 │                    └── Payments
 │
 ├────────────── Insurance Applications
 │                    │
 │                    └── Bank Scheme
 │
 ├────────────── Insurance Policy
 │                    │
 │                    └── Claims
 │                           │
 │                           └── Assessment
 │
 ├────────────── Notifications
 │
 └────────────── Audit Logs
```

The essential design principle is:

**Farmer data is the foundation; farms and crops provide agricultural context; risk is an independent prediction system; insurance is an intervention workflow; bank schemes are reusable definitions; applications represent farmer actions; policies and claims are separate future lifecycle entities.**

