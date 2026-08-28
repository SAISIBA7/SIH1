# Frontend PRD — Smart Crop Insurance Page

**Scope:** Frontend/UI only. No backend, database, auth, or payment logic.
**Location in repo:** All code, styles, and assets for this page live inside `Insurance/` (see §26).

---

## 1. Page Objective

Give the farmer a single, honest view of where they stand with crop insurance, why it matters *right now* given their current distress risk, and the next concrete step to take — without ever feeling like a generic insurance-marketplace page.

## 2. User Goal

> "Is my crop protected? If not, am I eligible, and what's the smallest next step?"

The farmer should never be dropped into a long form. Every screen answers one question and offers one action.

## 3. Entry Points

1. **Farmer Dashboard → More → 🛡️ Insurance** (manual, always available)
2. **Proactive surfacing from the dashboard** when distress risk is high:
   ```
   HIGH DISTRESS RISK
   81 / 100 🔴

   Your crop is currently at high risk.
   You may be eligible for crop insurance.

   [CHECK INSURANCE]
   ```
3. **Deep link from a notification** ("Your risk increased — insurance may help").

## 4. Information Architecture

```
Insurance
 ├─ Status (current state)
 ├─ Why This Matters (risk context)
 ├─ Eligibility
 │   ├─ Pre-filled profile check
 │   └─ Eligibility result
 ├─ Required Documents
 ├─ Registration (stepper)
 │   ├─ Review Details
 │   └─ Submission confirmation
 ├─ Application Status (timeline)
 ├─ About Crop Insurance (educational)
 └─ Claim Support (status-only, no claims logic)
```

## 5. Complete Page Layout

```
┌──────────────────────────────────────────────┐
│ ← Back              🛡️ Crop Insurance   🔊 EN │
├──────────────────────────────────────────────┤
│ YOUR INSURANCE STATUS                         │
│ ⚠️ NOT REGISTERED                             │
│ Paddy · 2.5 acres · Mayurbhanj                │
│ You may be eligible for crop insurance.       │
│ [ CHECK ELIGIBILITY ]                         │
├──────────────────────────────────────────────┤
│ 🚨 WHY THIS MATTERS                           │
│ 81/100 🔴 HIGH RISK                           │
│ Rainfall ↓35% · Soil moisture LOW · Health ↓18%│
├──────────────────────────────────────────────┤
│ ✓ ELIGIBILITY (pre-filled, editable)          │
│ Crop ✓  Location ✓  Land area ✓  Season ✓     │
│ [ CONTINUE ]                                   │
├──────────────────────────────────────────────┤
│ 📄 REQUIRED DOCUMENTS                          │
│ ✓ Aadhaar   ○ Land record   ○ Bank details    │
│ [ VIEW REQUIREMENTS ]                          │
├──────────────────────────────────────────────┤
│ 📝 REGISTRATION SUMMARY                        │
│ [ REGISTER FOR INSURANCE ]                     │
├──────────────────────────────────────────────┤
│ ABOUT CROP INSURANCE (educational, collapsed)  │
│ CLAIM SUPPORT (status-only)                    │
└──────────────────────────────────────────────┘
```

One primary CTA per screen state (see §13) — never 5–6 competing buttons.

## 6. Section-by-Section UI Specification

| Section | Purpose | Key elements |
|---|---|---|
| Header | Orientation + controls | Back button, page title, language switch, TTS toggle |
| Status card | Current standing at a glance | Status badge, crop/area/location, one-line explainer, primary CTA |
| Risk context card | Connects insurance to the distress loop | Risk score, top 3 factors, one-line bridge to insurance |
| Eligibility card | Pre-filled profile check | Field checklist, "we already have this" note, Edit link |
| Eligibility result | Outcome of the check | Verdict badge, matched fields, cautious language (§7 wording rules) |
| Document checklist | What's needed | Per-doc status (Uploaded/Pending/Verified/Rejected), upload action |
| Registration stepper | Guided submission | Progress indicator, back/continue, validation states |
| Review screen | Final confirmation | Read-only summary, Edit link, Submit |
| Status timeline | Post-submission tracking | Timeline component, application ID, current stage highlighted |
| Info card | Education, not promises | Plain-language explainer, link to official info |
| Claim support | Placeholder, not a claims flow | Empty state until a real claim exists |

## 7. Insurance Status States

The card at the top of the page renders one of five states. Wording stays cautious — never "guaranteed" or "approved" language unless the underlying state literally is `ACTIVE`.

**Not Registered**
```
⚠️ NOT REGISTERED
You are currently not registered for crop insurance.
You may be eligible based on your crop and location.
[CHECK ELIGIBILITY]
```

**Eligible**
```
✓ ELIGIBLE
You appear eligible for crop insurance.
Crop: Paddy · Area: 2.5 acres · Season: Kharif
[CONTINUE REGISTRATION]
```

**Application Pending**
```
🟡 APPLICATION PENDING
Submitted 12 Aug 2026 · Application ID INS-XXXXXX
Status: Under review
[VIEW APPLICATION STATUS]
```

**Active**
```
🟢 INSURANCE ACTIVE
Crop: Paddy · Area: 2.5 acres · Status: ACTIVE
[VIEW POLICY DETAILS]
```

**Action Required**
```
⚠️ ACTION REQUIRED
Your application needs additional information.
Missing: Land record
[COMPLETE APPLICATION]
```

Each state uses a distinct badge color (amber/green/blue/red‑amber) plus an icon — color is never the only signal (accessibility, §16).

## 8. Eligibility Flow

```
Insurance → Check Eligibility → Pre-filled profile review → Eligibility Result → Continue
```

Fields shown as already-known, not requested again:

```
✓ We already have this information
Crop: Paddy   Land: 2.5 acres   District: Mayurbhanj   Season: Kharif
[EDIT]
```

Result card uses hedged language only: *potentially eligible*, *appears eligible*, *based on available information* — never *approved* or *guaranteed*.

## 9. Registration Flow

```
Insurance → Check Eligibility → Eligibility Result → Review Details →
Required Documents → Registration Confirmation → Application Submitted → Track Status
```

Each step: clear title, one-line explanation of *why* this step exists, progress indicator, Back + Continue, inline validation, mobile-first single-column layout.

**Review screen** — read-only summary of farmer, location, crop, area, season, and document checklist, followed by `[EDIT DETAILS]` and `[SUBMIT REGISTRATION]`.

**Success screen**
```
✓ REGISTRATION SUBMITTED
Application ID: INS-2026-00124
Status: 🟡 UNDER REVIEW
[VIEW STATUS]
```

## 10. Required Documents UI

```
✓ Aadhaar / Identity proof — Uploaded
✓ Land record — Uploaded
○ Bank account details — Required
○ Crop / land information — Required
```

States per document: `Uploaded`, `Pending`, `Verified`, `Rejected`. Actions: Upload, Replace, Remove. Upload is mocked for the hackathon (no real file storage).

## 11. Application Status UI (Timeline)

```
✓ Registration submitted — 12 Aug 2026
✓ Documents received — 12 Aug 2026
● Application under review — current
○ Approval — pending
○ Insurance active — pending
```

Vertical timeline component; completed steps filled, current step highlighted, future steps outlined.

## 12. Risk-Context Integration

Insurance must read as an *intervention*, not a standalone product. The risk card always appears directly under the status card:

```
YOUR CURRENT RISK
81 / 100 🔴 HIGH

Why?
🌧️ Rainfall below normal
💧 Soil moisture low
🌱 Crop health declining

INSURANCE MAY HELP
You may be eligible for crop insurance based on
your crop, location and season.
[CHECK ELIGIBILITY]
```

Never claim coverage is guaranteed — only that insurance "may help" based on "applicable rules."

## 13. CTA Hierarchy

| State | Primary CTA |
|---|---|
| Not registered | CHECK ELIGIBILITY |
| Eligible | CONTINUE REGISTRATION |
| Pending | VIEW APPLICATION STATUS |
| Action required | COMPLETE APPLICATION |
| Active | VIEW POLICY DETAILS |

Exactly one primary (filled) button per screen; secondary actions (Edit, Learn more) are text links or outline buttons.

## 14. Navigation Behavior

Bottom nav (mobile): `Home · Crop · Monitor · Market · More`. Insurance sits under **More**, alongside Equipment, Government Schemes, Disaster Alerts, Notifications, Profile.

Page-level header on mobile: `← Back   🛡️ Crop Insurance`. Desktop reuses the existing Smart Crop sidebar — no new navigation pattern is introduced.

## 15. Responsive Behavior

Breakpoints: 320px+ (mobile), 768px+ (tablet), 1024px+ (desktop), 1440px+ (large desktop).

- **Mobile:** single-column, stacked cards, sticky primary CTA, large touch targets, bottom nav.
- **Tablet:** two-column sections where useful, wider cards.
- **Desktop:** centered content container, status/summary panel on one side, main workflow on the other, more generous spacing.

### Page background (this page specifically)

The Insurance page has a full-bleed background image behind all cards:

- **Default (any aspect ratio wider than 9:16 — tablet, desktop, landscape mobile):** `BG_3.png`
- **Portrait mobile, aspect ratio ≈ 9:16 or narrower (width:height ≤ 0.5625):** `BG_2.png`

The swap is triggered by the viewport's aspect ratio, not just its width, since the same width can appear in both a phone (tall) and a small desktop window (wide). Implementation is specified in §26.

Both images use `cover` fit with a subtle dark scrim beneath text-bearing cards so content stays legible regardless of which image is active. Swapping the background never causes layout shift — it's a fixed/absolute background layer independent of card flow.

## 16. Accessibility

- Status is never color-only: every badge pairs color with an icon and a text label.
- Minimum 44×44px tap targets on mobile.
- Semantic HTML/ARIA: headings in order, `role="status"` for the status card, `aria-live="polite"` for eligibility results and submission confirmations.
- Full keyboard navigation on desktop (stepper, document upload, review screen).
- Text contrast checked against both `BG_2.png` and `BG_3.png` (the scrim in §15 exists specifically for this).

## 17. Multilingual Considerations

Language switcher in the header: `English | हिंदी | ଓଡ଼ିଆ`. All copy strings are externalized (no hardcoded text in components) so translated strings — which typically run longer — don't break card layouts. Cards use flexible height, not fixed height.

## 18. Voice / TTS UI

A `🔊 Listen` affordance appears on: status card, risk card, eligibility result, and application status. TTS playback itself is not implemented — only the UI state (idle/playing/loading) and the button.

## 19. Loading States

```
Checking eligibility...
```
Skeleton loaders for the status card, risk card, and document list while data resolves.

## 20. Empty States

```
No insurance application found.
```
Shown when a farmer has no history at all (pairs with the Not Registered status state).

## 21. Error States

```
We couldn't complete the eligibility check.
Please try again.
[TRY AGAIN]
```
```
We need a little more information.
Please add your land area to continue.
[UPDATE PROFILE]
```
```
You're offline.
Some information may be unavailable.
Please reconnect to continue registration.
```

## 22. Component Breakdown

| Component | Responsibility |
|---|---|
| `InsuranceBackground` | Renders `BG_3`/`BG_2` and swaps on aspect-ratio change (§26) |
| `InsuranceHeader` | Back, title, language, TTS toggle |
| `InsuranceStatusCard` | Current state badge + primary CTA |
| `RiskContextCard` | Risk score + top factors, bridges to eligibility |
| `EligibilityCard` | Pre-filled profile fields + Edit |
| `EligibilityResult` | Verdict + matched fields |
| `FarmerDetailsCard` | Read-only farmer/crop/land summary |
| `DocumentChecklist` | Per-doc status list |
| `DocumentUpload` | Mocked upload/replace/remove |
| `RegistrationStepper` | Multi-step flow shell |
| `ReviewDetails` | Read-only submission review |
| `ApplicationStatus` / `StatusTimeline` | Post-submission tracking |
| `ActionRequiredCard` | Missing-info callout |
| `InsuranceInfoCard` | Educational copy |
| `ClaimSupportCard` | Status-only claims placeholder |
| `LanguageSelector`, `ListenButton` | Cross-cutting accessibility controls |
| `PrimaryCTA` | Single shared button component enforcing one-CTA-per-state |
| `EmptyState`, `LoadingState`, `ErrorState` | Shared feedback components |

## 23. Interaction Specifications

- **Check eligibility** → loading state → result card (success) or error state (failure).
- **Edit pre-filled info** → inline edit mode on the field, no full-page form.
- **Upload/replace/remove document** → mocked async state transition (Pending → Uploaded).
- **Continue registration / Submit** → advances stepper; Submit shows success screen with application ID.
- **Expand info card** → accordion, no navigation.
- **Switch language** → re-renders visible copy in place, no reload.
- **Listen** → toggles a mocked playing state on the button.
- **Back** → returns to previous step or previous page depending on context (stepper-aware).

## 24. Mock Data

```
Farmer: Ramesh
District: Mayurbhanj, Odisha
Crop: Paddy
Area: 2.5 acres
Season: Kharif
Risk: 81 / 100 — HIGH
Insurance: Not Registered

Application (once submitted):
ID: INS-2026-00124
Status: Under Review
```

Synthetic data only — no real farmer or government data.

## 25. Hackathon Demo Flow

```
Farmer Dashboard → Crop distress detected → Risk 81/100 🔴 →
System explains why → Insurance intervention surfaces →
Farmer opens Insurance → Eligibility check → Potentially eligible →
Review information → Submit registration → Application status shown
```

## 26. Frontend-Only Technical Considerations

**Stack:** Next.js 14+ (App Router), TypeScript, TailwindCSS, React Hook Form, Zod, Zustand, Recharts (only where a chart genuinely helps, e.g. risk breakdown).

**Everything for this page stays inside `Insurance/`.** Recommended layout, building on what's already there (`Insurance/image/BG_2.png`, `Insurance/image/BG_3.png`, `Insurance/insurance.tsx`):

```
Insurance/
 ├─ image/
 │   ├─ BG_2.png              (existing — mobile 9:16 background)
 │   └─ BG_3.png              (existing — default background)
 ├─ components/
 │   ├─ InsuranceBackground.tsx
 │   ├─ InsuranceHeader.tsx
 │   ├─ InsuranceStatusCard.tsx
 │   ├─ RiskContextCard.tsx
 │   ├─ EligibilityCard.tsx
 │   ├─ EligibilityResult.tsx
 │   ├─ DocumentChecklist.tsx
 │   ├─ RegistrationStepper.tsx
 │   ├─ ReviewDetails.tsx
 │   ├─ StatusTimeline.tsx
 │   ├─ InsuranceInfoCard.tsx
 │   ├─ ClaimSupportCard.tsx
 │   └─ shared/ (PrimaryCTA, EmptyState, LoadingState, ErrorState)
 ├─ hooks/
 │   └─ useResponsiveBackground.ts
 ├─ data/
 │   └─ mockInsurance.ts
 ├─ types/
 │   └─ insurance.ts
 └─ insurance.tsx             (existing — page entry, composes the above)
```

**Background image implementation — reference spec.** `BG_2.png` and `BG_3.png` already exist at `Insurance/image/BG_2.png` and `Insurance/image/BG_3.png` and are used from that location as-is — nothing moves to `public/`, nothing else needs to be added to the project for this to work. The two files below are the complete, drop-in implementation; a developer (or an AI coding assistant) building this page from this PRD can create them exactly as shown and the images already sitting in the folder are picked up automatically.

`Insurance/hooks/useResponsiveBackground.ts`
```ts
"use client";

import { useEffect, useState } from "react";

// True once the viewport aspect ratio reaches ~9:16 (portrait mobile).
const PORTRAIT_MOBILE_QUERY = "(max-aspect-ratio: 9/16)";

export function useResponsiveBackground() {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(PORTRAIT_MOBILE_QUERY);
    const update = () => setIsPortraitMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    window.addEventListener("orientationchange", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return isPortraitMobile;
}
```

`Insurance/components/InsuranceBackground.tsx`
```tsx
"use client";

import Image from "next/image";
import { useResponsiveBackground } from "../hooks/useResponsiveBackground";
import bgDefault from "../image/BG_3.png"; // already in the folder
import bgMobile from "../image/BG_2.png";  // already in the folder

// Default background is BG_3; swaps to BG_2 at ~9:16 (portrait mobile).
export function InsuranceBackground() {
  const isPortraitMobile = useResponsiveBackground();
  const activeBg = isPortraitMobile ? bgMobile : bgDefault;

  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={activeBg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
```

`Insurance/insurance.tsx` renders it first, then page content on top:
```tsx
import { InsuranceBackground } from "./components/InsuranceBackground";

export default function InsurancePage() {
  return (
    <div className="relative min-h-screen">
      <InsuranceBackground />
      <div className="relative z-10">{/* page content */}</div>
    </div>
  );
}
```

No file relocation, no `public/` folder changes, no external image hosting — the two images already stored in `Insurance/image/` are the only assets this requires.

## 27. Design Principles

- Agricultural, trustworthy, modern, calm, data-informed, farmer-friendly, intervention-focused.
- One question answered per section; one primary action per state.
- Risk always visible near insurance — it's the reason the page exists.
- Cautious, non-promissory language throughout ("may be eligible," never "guaranteed").
- No decorative UI that competes with the task at hand.

## 28. Explicit Out of Scope

Backend APIs, database/Prisma schema, Supabase auth, payment processing, real insurance-provider integration, real government verification, real document verification, real claims processing, real policy issuance, real SMS infrastructure, real TTS infrastructure. Future backend connection points may be noted in code comments, not implemented.
