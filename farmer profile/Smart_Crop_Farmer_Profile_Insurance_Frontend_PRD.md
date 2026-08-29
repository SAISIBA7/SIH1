# Smart Crop — Farmer Profile & Insurance
## Frontend Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Implementation-ready / Hackathon Build  
**Scope:** Farmer Profile + Farmer-facing Insurance Page only

---

## 1. Product Context

Smart Crop is an agricultural distress early-warning and intervention platform. Its core loop is:

`MONITOR → DETECT → PREDICT → EXPLAIN → INTERVENE → PREVENT`

The Farmer Profile is the platform's **data-foundation UI**, not a generic account/settings page. It represents who the farmer is, which farms/plots belong to them, what is currently being cultivated, and the information used by advisory, risk, financial-risk and insurance features.

Insurance is an **intervention mechanism**. The page must connect crop distress → insurance relevance → eligibility → available schemes → application → review → approval/policy, without treating an AI risk score as an insurance claim.

The existing project documents explicitly require separation of farmer/farm/crop concepts, multiple farms, farm-specific risk, sensitive financial information, and strict privacy/ownership behavior. fileciteturn1file1L320-L350

---

# 2. Scope

## In scope

### Farmer Profile
- Farmer identity
- Personal information
- Multiple farms/plots
- Current crop summary
- Historical/current crop distinction
- Financial summary
- Language preferences
- Notification preferences
- Insurance summary
- Profile completeness
- Loading/empty/error/success states
- Responsive/mobile-first UI

### Insurance
- Insurance status
- Risk context
- Eligibility check
- Multiple banks
- Multiple insurance schemes per bank
- Scheme filtering/matching
- Scheme details
- Required documents
- Application/review flow
- Application status/timeline
- Action-required states
- Future claim-support section
- Low-bandwidth and multilingual UX

## Out of scope

- Agriculture Officer dashboard
- Bank dashboard
- Government dashboard
- Real payment processing
- Real insurance-provider integration
- Real government verification
- Real claim settlement
- Real document verification
- Redesign of unrelated Smart Crop pages

---

# 3. Existing vs Planned Data

## 3.1 Currently available / existing insurance data

The current insurance table is only:

```text
insurance
----------
id
farmer_id
crop
status
```

Current conceptual statuses:

```text
not_registered
pending
approved
```

The frontend must NOT pretend the current table contains policy number, provider, premium, coverage, claims, assessment, settlement or policy dates. Those belong to future backend enhancements. fileciteturn2file3L507-L539

## 3.2 Planned bank data

Bank-related structures are planned/being created:

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

These fields are the baseline supplied for the project. fileciteturn2file6L1195-L1238

## 3.3 Planned bank-scheme data

There are currently **no bank-scheme tables**. The frontend must therefore use a data contract that can later be populated by backend APIs.

Conceptual hierarchy:

```text
Bank
 ├── Scheme 1
 ├── Scheme 2
 └── Scheme 3
```

The UI must support multiple banks and multiple schemes per bank; it must never hardcode one bank. Relevant schemes can be matched using farmer location, crop, land area, season, eligibility, bank relationship and policy availability. fileciteturn3file2L487-L582

Recommended future scheme display contract:

```ts
type BankScheme = {
  id: string
  bankId: string
  bankName: string
  schemeName: string
  description?: string
  cropsCovered: string[]
  eligibleLocations?: string[]
  eligibleSeasons?: string[]
  eligibilitySummary: string[]
  coverageAmount?: number
  premium?: number
  subsidy?: number
  policyPeriod?: string
  requiredDocuments: string[]
  availabilityStatus: "available" | "unavailable" | "unknown"
}
```

Any financial values shown during the prototype must be explicitly synthetic/demo data. fileciteturn2file3L567-L582

---

# 4. Personas

## Primary
**Farmer**
- Wants accurate profile information.
- Wants simple explanations.
- May use a mobile phone and low-bandwidth connection.
- May prefer English, Hindi or Odia.

## Secondary conceptual actors
- Bank/insurer: receives applications later.
- Agriculture officer: may receive risk/intervention information later.

The farmer-facing pages in this PRD must not expose dashboard functionality belonging to those roles.

---

# 5. User Stories

### Profile
1. As a farmer, I can see my personal information.
2. I can see all farms/plots associated with me.
3. I can see which crop belongs to each farm.
4. I can see current crop information without confusing it with historical crops.
5. I can edit permitted personal fields.
6. I can see a masked phone number.
7. I can change my language.
8. I can independently control notification categories.
9. I can see a concise financial summary without seeing unnecessary banking details.
10. I can see a summary of insurance status.

### Insurance
1. I can see whether I am registered.
2. I can understand why insurance may matter.
3. I can check potential eligibility using information already stored in my profile.
4. I can compare schemes from multiple banks.
5. I can view scheme details before applying.
6. I can see which documents are required.
7. I can review information before submitting.
8. I can see my application status.
9. I can understand whether an action is required.
10. I can distinguish crop risk from an insurance claim.

---

# 6. Navigation

Canonical routes:

```text
/farmer-profile
/insurance
```

Expected entry points:

```text
Farmer Dashboard
 ├── More → Profile
 └── Insurance
```

Insurance may also be surfaced proactively when risk is high.

Existing project guidance recommends `/farmer-profile` as the canonical profile route. fileciteturn0file3L349-L369

Back navigation must return to the previous logical Smart Crop screen.

---

# 7. Shared Design System

Use the existing Smart Crop direction:

- Deep forest greens
- Cream/light agricultural background
- Warm agricultural accents
- Card-based layout
- Clear typography
- Touch-friendly controls
- Premium but simple
- Minimal gradients
- No generic SaaS/dashboard appearance

The source frontend specification describes the same visual direction and accessibility requirements. fileciteturn3file2L675-L707

### Accessibility
- Semantic HTML
- Visible labels
- Keyboard navigation
- Visible focus
- ARIA attributes where needed
- Minimum 44×44px touch targets
- Inline validation/error association
- Never communicate status through color alone

---

# 8. Farmer Profile — Information Architecture

```text
Farmer Profile
├── Profile Hero
├── Personal Information
├── Farm Information
├── Current Crop
├── My Farms
├── Financial Information
├── Insurance Summary
├── Language
└── Notifications
```

The existing profile structure includes identity, personal information, farm information, current crop, financial information, language, notifications and My Farms. fileciteturn2file2L360-L417

---

# 9. Farmer Profile — Layout

## Mobile: 360–430px

Single-column layout:

```text
← MY PROFILE                         [Edit]

[Avatar] Farmer Name
Village, District
Profile completeness

PERSONAL INFORMATION
Name
Phone
Village
District
State
Language

MY FARMS
Farm 01
Land | Location | Crop
[View]
[+ Add Farm]

CURRENT CROP
Crop | Acreage | Health | Stage
[View Crop]

FINANCIAL INFORMATION
Loan summary
Due information

INSURANCE
Status
Crop
[View Insurance]

LANGUAGE
[English] [हिंदी] [ଓଡ଼ିଆ]

NOTIFICATIONS
Weather      [toggle]
Risk         [toggle]
Market       [toggle]
Farming      [toggle]
Officer      [toggle]
```

## Tablet/Desktop

- Hero remains full width.
- Content becomes a two-column grid.
- Left: Personal Information, Farm Information, My Farms.
- Right: Current Crop, Financial Information, Insurance, Language, Notifications.

---

# 10. Profile Hero

### Display
- Farmer name
- Avatar/initial
- Village
- District
- Computed profile completeness
- Edit button

### Rules
- Completeness is computed from available profile fields.
- Never hardcode `85%`, `100%`, etc.
- Hero is read-only except for the Edit action.

---

# 11. Personal Information

Fields:

| Field | Display | Edit |
|---|---|---|
| Name | Full | Yes |
| Phone | Masked | Verification flow if changed |
| Village | Full | Yes/verification depending on backend |
| District | Full | Validated/controlled |
| State | Full | Controlled/validated |
| Language | Native-language label | Yes |

Phone should remain masked outside an explicit permitted edit flow.

---

# 12. Farm Information

Display:

- Farm/plot label
- Area
- Village
- District
- State
- Location
- GPS indicator if available
- Current crop
- Sowing date
- Current stage

Farm data is **read-only on the profile page**. Farm/crop edits belong to their dedicated farm/crop flows to avoid duplicate editing surfaces. fileciteturn2file1L244-L251

The UI must support multiple farms.

---

# 13. My Farms

Each farm card shows:

```text
Farm 01
2.5 acres
Village, District
Paddy
Current season
[View Farm]
```

Actions:

- View Farm
- Add Farm

Empty state:

```text
🌱 No farm added yet

Add your farm information to receive
more personalized advice.

[Add Farm]
```

This empty-state behavior is consistent with the existing profile specification. fileciteturn1file2L365-L388

---

# 14. Current Crop

Display:

- Crop icon
- Crop name
- Acreage
- Health badge
- Sowing date
- Current stage
- Season
- View Crop

The card is a summary only. Do not duplicate the Crop Monitoring/Risk page.

Important: current crop is associated with a farm/season, not permanently with the farmer.

---

# 15. Current vs Historical Crop UX

The UI must avoid implying that a farmer has one permanent crop.

Preferred pattern:

```text
CURRENT
Paddy
Kharif 2026
Farm 01

HISTORY
Previous crop records
```

If historical crop data is not returned by the backend, do not invent it.

---

# 16. Financial Information

Display only the minimum useful information:

- Loan amount or summarized outstanding amount, if returned
- Days until due
- Due date

Do not display:
- Full bank account number
- Unnecessary bank details
- Payment history on the profile

Financial information is sensitive and must not be exposed unnecessarily. Backend architecture explicitly requires sensitive-field protection and account masking. fileciteturn3file1L395-L430

If the due date is close, use:
- Text
- Icon
- Accessible status label

Never rely on red/yellow/green alone.

---

# 17. Insurance Summary on Profile

The profile contains only a concise summary:

```text
INSURANCE

Paddy
Status: Not Registered

You may be eligible.
[View Insurance]
```

For current MVP, valid statuses are:

- Not Registered
- Pending
- Approved

Detailed scheme/policy/application/claim UI belongs on `/insurance`.

---

# 18. Language

Supported:

- English
- Hindi / हिंदी
- Odia / ଓଡ଼ିଆ

Use native-script labels.

Changing language should:
1. Update selected state.
2. Persist through the future backend.
3. Show a concise success confirmation.

The project specifically identifies English/Hindi/Odia as demo languages. fileciteturn1file5L982-L988

---

# 19. Notifications

Five independent categories:

- Weather
- Risk
- Market
- Farming Reminders
- Officer Updates

Each toggle:
- Is independently controlled.
- Has a visible label.
- Uses an accessible switch.
- Has an active/inactive state that does not rely only on color.

Notifications should also support read/unread states when notification records are available.

---

# 20. Profile Edit Flow

Do not use uncontrolled inline editing across the page.

Mobile:
- Bottom sheet.

Desktop:
- Centered modal.

Editable fields:
- Name
- Phone
- Village
- District
- Language

Farm/crop/risk/loan/insurance approval fields are not directly editable from this form.

Backend rules distinguish farmer-editable, read-only, verification-required, system-generated and role-controlled fields. fileciteturn2file0L147-L172

---

# 21. Profile Validation

Use React Hook Form + Zod.

Examples:

```text
Name
- required
- trimmed
- reasonable length

Phone
- valid supported phone format
- changing phone requires verification

Village
- required
- trimmed

District
- required
- validated against allowed location data if available
```

Errors must appear beside the relevant field and be announced/accessibly associated.

Unsaved changes:
- Show an unsaved indicator.
- Confirm before closing if changes would be lost.

---

# 22. Profile States

## Loading
Use skeleton cards matching the final layout.

## Empty
If no farm:

```text
No farm added yet
[Add Farm]
```

## Error

```text
Something went wrong
We couldn't load your profile.
[Try Again]
```

## Save success

```text
Profile updated successfully.
```

## Partial data
Render available information and clearly label unavailable fields rather than inserting fake values.

The existing profile PRD requires loading, empty and error states and explicitly provides these patterns. fileciteturn1file2L365-L411

---

# 23. Insurance Page — Product Goal

The page must answer:

1. What is my current insurance status?
2. Why is insurance relevant?
3. Am I potentially eligible?
4. What crop/farm information is being considered?
5. Which bank schemes are available?
6. What do I need to do?
7. What is my application status?

Insurance is an intervention, not a generic insurance marketplace. fileciteturn1file4L15-L53

---

# 24. Insurance Page Information Architecture

```text
Insurance
├── Current Insurance Status
├── Why Insurance Matters / Risk Context
├── Eligibility
├── Available Bank Schemes
│   ├── Bank A
│   │   ├── Scheme 1
│   │   └── Scheme 2
│   └── Bank B
│       ├── Scheme 1
│       └── Scheme 2
├── Scheme Details
├── Required Documents
├── Registration/Application
├── Application Status
├── Claim Support (future)
├── Insurance Information
└── Help / Support
```

---

# 25. Insurance Status Card

## Not Registered

```text
NOT REGISTERED

Crop: Paddy
Farm: Farm 01
Area: 2.5 acres
Location: District, State

You may be eligible for crop insurance.

[CHECK ELIGIBILITY]
```

## Pending

```text
APPLICATION PENDING

Application ID: INS-XXXXXX
Status: Under review

[VIEW STATUS]
```

## Approved / Active

```text
INSURANCE ACTIVE

Crop: Paddy
Farm: Farm 01
Status: Active

[VIEW DETAILS]
```

## Action Required

```text
ACTION REQUIRED

Your application needs more information.

Missing:
Land record

[COMPLETE APPLICATION]
```

Do not use color as the only indicator.

---

# 26. Risk Context

If a real risk response exists, show:

```text
YOUR CURRENT CROP RISK
81 / 100
HIGH

Why?
Rainfall below normal
Soil moisture low
Crop health declining

INSURANCE MAY HELP

You may be eligible based on
your crop, location and season.

[CHECK ELIGIBILITY]
```

If risk data is unavailable:
- Do not fabricate a score.
- Show a neutral unavailable state.
- Insurance remains independently usable.

The project explicitly states that risk should encourage insurance attention but must not automatically create a claim. fileciteturn2file3L542-L571

---

# 27. Eligibility UX

Pre-fill data already available:

- State
- District
- Crop
- Farm
- Land area
- Season
- Sowing information when relevant
- Farmer category only when required

Show:

```text
✓ We already have this information
```

Allow the farmer to correct missing information through the appropriate profile/farm flow.

Eligibility wording must be cautious:

- Potentially eligible
- Appears eligible
- Based on available information

Never present a frontend eligibility result as official government approval unless backend/source data explicitly supports it. fileciteturn2file4L746-L774

---

# 28. Bank Scheme Listing

This is a key new requirement.

## Scheme discovery

Display schemes grouped by bank:

```text
AVAILABLE SCHEMES

[All Banks] [Relevant to Me]

BANK A
 ┌───────────────────────┐
 │ Scheme Alpha          │
 │ Paddy                  │
 │ Kharif                 │
 │ Potentially eligible   │
 │ Coverage: Demo value  │
 │ Premium: Demo value   │
 │ [View Details]         │
 │ [Apply]                │
 └───────────────────────┘

BANK B
 ┌───────────────────────┐
 │ Scheme Beta           │
 │ ...                    │
 └───────────────────────┘
```

## Filters

- Bank
- Crop
- Season
- Location
- Eligibility
- Existing bank relationship
- Availability

On mobile, filters should open in a bottom sheet.

---

# 29. Scheme Ranking / Relevance

The frontend should accept a backend-provided relevance indicator.

Possible labels:

- Recommended for you
- Matches your crop
- Available in your area
- Existing bank relationship
- Eligibility needs review

Do not create an unsupported eligibility decision solely in the frontend.

---

# 30. Scheme Card

Each scheme can show:

- Bank name
- Branch name when relevant
- Scheme name
- Crop covered
- Eligibility summary
- Coverage amount, if provided
- Premium, if provided
- Policy period, if provided
- Government subsidy, if provided
- Required documents
- Application status
- Apply
- View Details

If a field is unavailable, hide it or display `Not available`; never invent it.

---

# 31. Scheme Details

Full-screen mobile view / modal or route on desktop.

Sections:

1. Scheme overview
2. Bank/branch
3. Covered crops
4. Eligible locations
5. Season
6. Eligibility criteria
7. Coverage
8. Premium/subsidy
9. Policy period
10. Required documents
11. Application status
12. Apply CTA
13. Official information/help

All financial values must be marked as demo data until sourced from backend.

---

# 32. Insurance Application Flow

Use a progressive flow:

```text
Insurance
 ↓
Check Eligibility
 ↓
Eligibility Result
 ↓
Select Scheme
 ↓
Review Details
 ↓
Required Documents
 ↓
Confirmation
 ↓
Application Submitted
 ↓
Track Status
```

Each step requires:
- Title
- Short explanation
- Progress indicator
- Back
- Continue
- Validation/error state
- Mobile-friendly layout

This follows the existing Insurance frontend specification. fileciteturn1file7L1310-L1344

---

# 33. Review Before Submission

Show:

```text
REVIEW INSURANCE APPLICATION

Farmer
Name

Farm
Farm 01

Location
District, State

Crop
Paddy

Area
2.5 acres

Season
Kharif

Bank
Selected bank

Scheme
Selected scheme

DOCUMENTS
✓ Document A
✓ Document B
○ Document C

Please verify your details.

[EDIT]
[SUBMIT APPLICATION]
```

The submit CTA must clearly indicate that this sends an application for review, not that it instantly creates an active policy.

---

# 34. Application Success

Example:

```text
✓ APPLICATION SUBMITTED

Your insurance application has been submitted.

Application ID
INS-2026-00124

Status
UNDER REVIEW

[VIEW STATUS]
```

The application ID in prototype data must be synthetic.

---

# 35. Status Timeline

Use:

```text
INSURANCE APPLICATION

✓ Application submitted
  Date

✓ Documents received
  Date

● Under review
  Current status

○ Approval
  Pending

○ Insurance active
  Pending
```

Future backend may provide a richer timeline. The UI should already support timeline events.

The source specification explicitly calls for a clear status timeline. fileciteturn1file5L1033-L1058

---

# 36. Required Documents

Document checklist states:

- Required
- Uploaded
- Pending
- Verified
- Rejected

Actions where supported:

- Upload
- Replace
- Remove
- View status

For the hackathon, upload behavior may be mocked.

Do not claim a document is verified unless backend data says so. fileciteturn1file5L1062-L1102

---

# 37. Claims

Current insurance table does not support full claims.

Therefore MVP UI:

```text
CLAIM SUPPORT

No active claims.

If an insured crop experiences an
eligible loss, claim information will
appear here.

[LEARN ABOUT CLAIMS]
```

Do not show fake claim amounts or settlements.

Future claim UI may support:
- Claim submitted
- Assessment
- Approved/rejected
- Settlement
- Timeline
- Documents

---

# 38. Insurance Education

Simple information card:

```text
ABOUT CROP INSURANCE

Crop insurance can provide financial
protection against eligible crop losses
under the applicable scheme.

Coverage, eligibility and claim rules
depend on the relevant scheme and
official guidelines.

[VIEW OFFICIAL INFORMATION]
```

No legal or guaranteed-payout language. fileciteturn1file5L1106-L1135

---

# 39. Multilingual / Voice UX

Support English, Hindi and Odia.

Where available:
- Listen button
- Language selector
- Short farmer-friendly text

Voice/TTS must explain existing verified information; it must not invent financial/agricultural facts.

The wider Smart Crop product uses Bhashini for translation/TTS and identifies SMS/voice as important low-connectivity channels. fileciteturn1file5L982-L1005

---

# 40. Low-Bandwidth Behavior

- Avoid unnecessary images.
- Prefer CSS/icons over large assets.
- Load cards progressively.
- Cache non-sensitive display data where appropriate.
- Keep text concise.
- Do not block the entire page because scheme details fail.
- Provide an offline/network state.

Example:

```text
You're offline.

Some information may be unavailable.
Please reconnect to continue registration.

[TRY AGAIN]
```

---

# 41. Frontend State Model

Recommended state:

```ts
type ProfileState =
  | "loading"
  | "ready"
  | "empty"
  | "error"
  | "saving"

type InsuranceStatus =
  | "not_registered"
  | "eligible"
  | "pending"
  | "approved"
  | "action_required"

type EligibilityState =
  | "idle"
  | "checking"
  | "eligible"
  | "not_eligible"
  | "needs_information"
  | "error"

type ApplicationState =
  | "idle"
  | "review"
  | "submitting"
  | "submitted"
  | "error"
```

---

# 42. Component Breakdown

## Profile
- `ProfileHeader`
- `ProfileCompleteness`
- `PersonalInfoCard`
- `FarmInfoCard`
- `FarmList`
- `FarmCard`
- `CurrentCropCard`
- `FinancialSummaryCard`
- `InsuranceSummaryCard`
- `LanguageSelector`
- `NotificationPreferences`
- `ProfileEditSheet`
- `EmptyState`
- `LoadingSkeleton`
- `ErrorState`

## Insurance
- `InsuranceHeader`
- `InsuranceStatusCard`
- `RiskContextCard`
- `EligibilityCard`
- `EligibilityResult`
- `BankFilter`
- `SchemeList`
- `BankGroup`
- `SchemeCard`
- `SchemeDetails`
- `DocumentChecklist`
- `DocumentUpload`
- `RegistrationStepper`
- `ReviewApplication`
- `ApplicationSuccess`
- `ApplicationStatus`
- `StatusTimeline`
- `ActionRequiredCard`
- `InsuranceInfoCard`
- `ClaimSupportCard`
- `ListenButton`

---

# 43. API Dependency Contract

The frontend should be built against typed service functions, not hardcoded page logic.

Expected dependencies:

| Purpose | Endpoint |
|---|---|
| Profile | `GET /api/profile` |
| Update profile | `PUT /api/profile` |
| Farms | `GET /api/farms` |
| Add farm | `POST /api/farms` |
| Farm details | `GET /api/farms/:id` |
| Farm update | `PUT /api/farms/:id` |
| Farm crops | `GET /api/farms/:farmId/crops` |
| Risk | `GET /api/farms/:farmId/risk` |
| Risk history | `GET /api/farms/:farmId/risk/history` |
| Banks | `GET /api/banks` |
| Bank details | `GET /api/banks/:id` |
| Bank schemes | `GET /api/bank-schemes` |
| Schemes by bank | `GET /api/banks/:bankId/schemes` |
| Insurance | `GET /api/insurance` |
| Insurance detail | `GET /api/insurance/:id` |
| Applications | `GET /api/insurance/applications` |
| Submit application | `POST /api/insurance/applications` |
| Update application | `PUT /api/insurance/applications/:id` |
| Documents | `GET/POST /api/documents` |
| Notifications | `GET /api/notifications` |

These routes align with the backend project specification. fileciteturn3file0L163-L239

---

# 44. Security / Privacy UX

Frontend must:
- Never use a farmer ID from the URL as proof of identity.
- Never expose another farmer's data.
- Mask phone/account information.
- Never allow the farmer to edit risk score.
- Never allow the farmer to edit loan outstanding amount.
- Never allow the farmer to set insurance approval status.
- Never treat frontend role state as authorization.

Backend remains the final authority for ownership and authorization. fileciteturn2file0L119-L144

---

# 45. Demo Data Strategy

Use synthetic data only.

Example:

```text
Farmer: Ramesh
District: Mayurbhanj
State: Odisha
Farm: Farm 01
Area: 2.5 acres
Crop: Paddy
Season: Kharif
Risk: 81/100 HIGH
Insurance: Not Registered
```

Example schemes:

```text
Bank A
 ├── Paddy Protection Scheme
 └── Seasonal Crop Cover

Bank B
 ├── Farmer Crop Shield
 └── Kharif Crop Protection
```

These names and financial values must be labeled as synthetic/demo data unless real backend data is later supplied.

---

# 46. Critical UX Rules

1. Farmer ≠ Farm ≠ Crop.
2. One farmer can have multiple farms.
3. One farm can have multiple crop records over time.
4. Risk belongs to the correct farm/crop.
5. Profile does not invent risk.
6. Financial data is sensitive.
7. Insurance summary belongs on Profile; detailed workflow belongs on Insurance.
8. Multiple banks and schemes must be supported.
9. No bank is hardcoded as the only provider.
10. High risk ≠ insurance claim.
11. Eligibility ≠ official approval.
12. Application ≠ active policy.
13. Do not invent coverage, premium or settlement values.
14. Do not use color alone for status.
15. Keep the farmer informed at every step.

---

# 47. Acceptance Criteria

## Profile
- [ ] Farmer identity is visible.
- [ ] Personal fields are clearly separated from farm fields.
- [ ] Multiple farms are supported.
- [ ] Crop is represented as farm/season data.
- [ ] Current crop is distinguishable from historical data.
- [ ] Financial information is minimal and protected.
- [ ] Insurance summary links to Insurance page.
- [ ] Language selector supports English/Hindi/Odia.
- [ ] Notification categories are independent.
- [ ] Edit flow validates fields.
- [ ] Completeness is computed.
- [ ] Loading/empty/error/success states exist.
- [ ] Mobile layout works at 360–430px.
- [ ] Desktop/tablet layout uses a two-column structure.
- [ ] Accessibility requirements are met.

## Insurance
- [ ] Current insurance status is visible.
- [ ] Risk context is shown only when real data exists.
- [ ] Eligibility uses pre-filled profile/farm information.
- [ ] Multiple banks are supported.
- [ ] Multiple schemes per bank are supported.
- [ ] Filters exist for relevant scheme discovery.
- [ ] Scheme cards show only available data.
- [ ] Scheme details are accessible.
- [ ] Registration uses a progressive flow.
- [ ] Required documents have explicit states.
- [ ] Review step exists.
- [ ] Submission success state exists.
- [ ] Application timeline exists.
- [ ] Claim UI does not invent unsupported claims.
- [ ] Risk never creates a claim.
- [ ] No unsupported financial promises are displayed.

---

# 48. Definition of Done

The frontend is complete when a farmer can:

```text
Open Profile
   ↓
Understand personal + farm data
   ↓
See multiple farms
   ↓
See current crop
   ↓
See concise financial/insurance summary
   ↓
Open Insurance
   ↓
Understand current status
   ↓
See why insurance may matter
   ↓
Check potential eligibility
   ↓
Browse multiple banks
   ↓
Compare multiple schemes
   ↓
View scheme details
   ↓
Review required documents
   ↓
Submit an application
   ↓
Track application status
```

The final implementation must feel like a trusted Smart Crop intervention flow, not a generic insurance portal.
