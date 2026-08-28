# Frontend PRD — Government Schemes Page
## Smart Crop — Intervention Layer

**Feature type:** `[Intervene]` — MONITOR → DETECT → PREDICT → EXPLAIN → **INTERVENE** → PREVENT
**Codebase location:** `Government equipment schemes/`
**Version:** 1.0 | **Status:** Draft (SIH build)

---

## 1. Feature Overview

The Government Schemes page is the point where Smart Crop stops just describing a farmer's risk and starts connecting them to money, subsidies, and support they're actually entitled to. It is not a scheme directory — a farmer never browses a list of every scheme that exists. Every scheme shown has already been filtered against their profile (location, crop, land size, category, current distress level), so the page only ever shows things that are plausibly theirs.

It sits under the same intervention layer as Insurance and Equipment Rental, but where Insurance is one flow and Equipment Rental is a marketplace, Schemes is a **matched list → detail → eligibility proof → documents → application → tracking** pipeline. The complexity is in making five bureaucratic steps feel like two taps.

## 2. User Problem

Farmers know government schemes exist. What breaks down is:

- They don't know which ones apply to *them specifically*.
- Government portals bury eligibility in legal language nobody reads on a phone.
- Nobody tells them *why* they qualify — so they assume it's not for them and skip it.
- Document requirements are scattered across PDFs; they find out what's missing only after standing in a queue.
- Once applied, there's no visibility into status — it disappears into a government system.

Smart Crop already knows the farmer's district, crop, land size, and risk level. The Schemes page's whole job is to use that data so the farmer never has to self-diagnose eligibility.

## 3. Goals

| Goal | How the frontend proves it |
|---|---|
| Feel personalized, not like a portal | Every entry point uses "you," never "available schemes" |
| Make eligibility legible instantly | Every card shows a % + the specific matched criteria, not just a badge |
| Kill document-related application failure | Checklist is visible before the farmer starts, not after |
| Close the loop | Status tracker is always one tap away from any scheme the farmer applied to |
| Work for a low-literacy, Odia-first user | Voice narration + simple-text toggle available on every screen in this flow |

## 4. User Persona

👨‍🌾 **Ramesh** — Mayurbhanj, Odisha · Paddy · 2.5 acres · Odia · currently flagged 🔴 81/100 distress risk (rainfall + market + loan proximity)

Ramesh doesn't open this page to browse. He opens it because the dashboard told him support exists, or because his risk score is high enough that Smart Crop is proactively surfacing it. He needs to see *"this is for people like you"* within one screen, not discover it three taps deep.

## 5. Information Architecture

```
Farmer Dashboard
      │
      ├── (proactive surfacing when risk is high, same as Insurance)
      │
      ▼
🏛️ GOVERNMENT SCHEMES (Hub)
      │
      ├── Hero: farmer profile + match count + eligibility summary
      ├── Category Filter (Crop Support / Equipment Subsidy / Irrigation /
      │                     Insurance / Financial Assistance / Farmer Welfare)
      ├── Recommended Scheme Cards (matched + ranked by eligibility %)
      │
      ▼
📄 SCHEME DETAILS
      │
      ├── About
      ├── Why you're eligible ── Eligibility Explanation
      ├── Benefits
      ├── Required Documents ── Document Checklist
      ├── Application Process
      └── [Apply]
                 │
                 ▼
        📍 APPLICATION TRACKING
        Submitted → Verification → Approved
```

Entry points into this hub: bottom nav → **More → Government Schemes**, and a direct card injected into the dashboard's "What needs your attention" section when a scheme match is high-confidence (mirrors how Insurance surfaces itself).

## 6. Complete Page Wireframe Description

### 6.1 Hero / Hub — mobile (default)

```
┌─────────────────────────────────────┐
│ [bg: img/1 (1).jpeg or img/3.png —  │
│  see §9 for which, glass overlay]   │
│                                     │
│  🏛️ Support for you                 │
│  Ramesh · Mayurbhanj · Paddy · 2.5ac│
│                                     │
│   ┌───────────────────────────┐    │
│   │   6 schemes match you     │    │
│   │   Best match: 92%         │    │
│   └───────────────────────────┘    │
│                                     │
│  "Based on your crop, land and      │
│   district, here's what you        │
│   may be entitled to."             │
│                                     │
│  🔊 Listen in Odia                  │
├─────────────────────────────────────┤
│ [Crop Support] [Equipment] [Irriga… │  ← horizontally
│                                      │    scrollable chips
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏛️ PM-KISAN                     │ │
│ │ Ministry of Agriculture          │ │
│ │ ● 92% match                     │ │
│ │ ₹6,000/year direct support       │ │
│ │ Docs: 2 of 3 ready               │ │
│ │           [View Details →]       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🚜 Equipment Subsidy             │ │
│ │ ...                              │ │
│ └─────────────────────────────────┘ │
│                                     │
│              [🏠][🌱][📊][💰][More●]│
└─────────────────────────────────────┘
```

Note the deliberate rewording throughout: never "Available Government Schemes" → always "Schemes you may be eligible for" / "Support for you." This is a copy rule, not just a hero-section rule — it should hold on every heading in this feature.

### 6.2 Scheme Details

```
┌─────────────────────────────────────┐
│ ← Back              PM-KISAN         │
├─────────────────────────────────────┤
│ ● 92% eligible                       │
│                                       │
│ ABOUT                                 │
│ Direct income support for small and   │
│ marginal farmer families.             │
│                                       │
│ WHY YOU QUALIFY                       │
│ ✓ Land size — 2.5 acres (within limit)│
│ ✓ Crop — Paddy (eligible category)    │
│ ✓ Location — Odisha (state active)    │
│ ✗ Bank account linkage — action needed│
│                                       │
│ BENEFITS                              │
│ ₹6,000/year in 3 installments          │
│                                       │
│ REQUIRED DOCUMENTS            2/3 ✓   │
│ ✓ Aadhaar Card                        │
│ ✓ Land Record (RoR)                   │
│ ○ Bank Passbook                       │
│           [Upload / Mark Ready]        │
│                                       │
│              [APPLY NOW]              │
└─────────────────────────────────────┘
```

### 6.3 Application Tracking

```
┌─────────────────────────────────────┐
│ PM-KISAN — Application Status         │
├─────────────────────────────────────┤
│  ● Submitted        12 Aug            │
│  │                                    │
│  ● Verification      In progress      │
│  │                                    │
│  ○ Approved                           │
│                                       │
│  Estimated: 7–10 working days         │
└─────────────────────────────────────┘
```

### 6.4 Empty / Error states

```
No matches yet:            Error:
┌─────────────────────┐    ┌─────────────────────┐
│  🌾                  │    │  ⚠️                  │
│  No schemes match     │    │  Couldn't load        │
│  your profile yet    │    │  schemes right now    │
│  Update your profile  │    │  [Retry]              │
│  for better matches   │    │                       │
│  [Complete Profile]   │    │                       │
└─────────────────────┘    └─────────────────────┘
```

## 7. Component Breakdown

All components below live in `Government equipment schemes/` (see §11 for exact file layout).

### `SchemeHero`
- **Purpose:** Personalized entry banner — identity, match count, top eligibility %, background art, voice trigger.
- **Props:** `farmerName`, `district`, `crop`, `landArea`, `matchCount`, `topMatchPercent`, `onListenClick`
- **States:** default · loading (skeleton over background) · zero-match (softer copy, no match count)
- **Responsive:** background image swaps per §9; on desktop the hero becomes a wider banner with the farmer summary and match count side-by-side instead of stacked.

### `FarmerProfileCard`
- **Purpose:** Compact profile chip reused across Hero and Scheme Details to remind the farmer what's being matched against.
- **Props:** `district`, `crop`, `landArea`, `category`
- **States:** default · editable (tap to jump to Profile page if data is incomplete)
- **Responsive:** inline row on mobile, becomes a sticky side card on desktop detail view.

### `SchemeCard`
- **Purpose:** Single scheme summary in the recommended list.
- **Props:** `name`, `department`, `eligibilityPercent`, `benefitSummary`, `documentsReadyCount`, `documentsTotalCount`, `applicationStatus?`, `onViewDetails`
- **States:** default · applied (shows status pill instead of "View Details") · approved (green accent) · document-incomplete (amber flag)
- **Responsive:** full-width stacked (mobile) → 2-col grid (tablet) → 3-col grid (desktop)

### `EligibilityBadge`
- **Purpose:** The single visual proof-point that eligibility isn't guesswork — a % plus color tier.
- **Props:** `percent`, `size ('sm' | 'lg')`
- **States:** high (≥80%, green) · medium (50–79%, amber) · low (<50%, gray, generally not shown in recommended list but used in "explore more" fallback)
- **Responsive:** same component, `size` prop controls sm (card) vs lg (hero/detail) rendering — no layout logic needed.

### `CategoryFilter`
- **Purpose:** Horizontally scrollable chip filter — Crop Support, Equipment Subsidy, Irrigation Support, Insurance Support, Financial Assistance, Farmer Welfare.
- **Props:** `categories[]`, `activeCategory`, `onChange`
- **States:** default · active-chip · disabled (category has zero matches — shown grayed, not hidden, so the farmer knows it was checked)
- **Responsive:** horizontal scroll (mobile/tablet) → full inline row, no scroll (desktop)

### `SchemeDetails`
- **Purpose:** Container for the full detail page — About, Benefits, Eligibility, Documents, Apply CTA.
- **Props:** `scheme` (full scheme object), `farmerProfile`
- **States:** default · applying (CTA shows spinner) · applied (CTA replaced by status link)
- **Responsive:** single scroll column (mobile) → two-column layout on desktop, sticky `FarmerProfileCard` + `ApplicationTimeline` in the right rail once applied.

### `DocumentChecklist`
- **Purpose:** Visual proof of what's ready vs missing, shown before the farmer commits to applying.
- **Props:** `documents: {name, status: 'ready'|'missing'}[]`, `onMarkReady`
- **States:** default · all-ready (unlocks Apply CTA) · incomplete (Apply CTA stays enabled but shows a warning toast, never hard-blocks — some farmers apply and gather docs after)
- **Responsive:** vertical list throughout; only spacing/typography scales up.

### `ApplicationTimeline`
- **Purpose:** Three-stage tracker — Submitted → Verification → Approved.
- **Props:** `currentStage`, `submittedDate`, `estimatedDays`
- **States:** submitted · in-verification · approved · rejected (needs a distinct red state with a reason string, even though not explicitly requested — a tracker that can't show rejection is incomplete)
- **Responsive:** vertical stepper (mobile) → horizontal stepper (tablet/desktop)

### `VoiceButton`
- **Purpose:** Odia (and other supported language) narration trigger, reused from the platform's existing voice-accessibility pattern.
- **Props:** `textToRead`, `language`, `isPlaying`, `onToggle`
- **States:** idle · playing (waveform animation) · unavailable (language not supported for this content yet)
- **Responsive:** identical across breakpoints — always a fixed-size tap target, never shrinks below 44px touch target.

### `BottomNavigation`
- **Purpose:** Shared platform nav — reused as-is from the dashboard, not rebuilt for this page.
- **Props:** `activeTab`
- **States:** n/a (presentational)
- **Responsive:** visible mobile/tablet only; hidden on desktop where nav is presumably a side/top bar per existing dashboard shell.

## 8. Interaction Design

- **Hub → Details:** tapping a `SchemeCard` transitions via a shared-element style motion (card expands into the detail header) using Framer Motion `layoutId`, consistent with the glassmorphism/matte-panel motion language already used on the dashboard.
- **Category filter:** selecting a chip re-filters the list with a quick fade/slide (150–200ms), not a full page reload — this is client-side filtering over already-fetched matched schemes.
- **Eligibility explanation:** the "why you qualify" checklist items animate in with a slight stagger (60–80ms between items) on first view, reinforcing that each checkmark was individually evaluated rather than dumped as a static block.
- **Document checklist:** marking a document "ready" gives immediate optimistic UI feedback (checkmark + color shift) before any backend confirmation, since this is a low-stakes local toggle, not a submission.
- **Apply flow:** tapping **Apply Now** shows a lightweight confirmation sheet (not a full page) reiterating benefit + missing docs warning if any, then transitions the CTA into a status-tracking entry point — no separate "success" interstitial page.
- **Voice:** `VoiceButton` press reads the current section's copy (hero message, eligibility reasons, or benefits, depending on where it's placed) rather than the whole page at once — shorter, more useful audio chunks.

## 9. Responsive Behavior

### Mobile (default, <768px)
- Single-column stacked cards, bottom nav visible, large tap targets (≥44px).
- Category filter is a horizontally scrollable chip row.
- **Background asset rule:** if the rendered hero container's aspect ratio resolves to ~9:16 (portrait phone), use `img/3.png`. This is checked via a CSS `aspect-ratio` media query first, with a JS `matchMedia` fallback for older WebViews:
  ```css
  .scheme-hero { background-image: url('/government-equipment-schemes/img/1 (1).jpeg'); }
  @media (aspect-ratio: 9/16), (max-aspect-ratio: 9/16) {
    .scheme-hero { background-image: url('/government-equipment-schemes/img/3.png'); }
  }
  ```
- All hero text sits over a glass/matte overlay (existing design token) regardless of which background loads, so contrast doesn't depend on the image.

### Tablet (768–1023px)
- Scheme cards move to a 2-column grid.
- Hero keeps the wide `1 (1).jpeg` background since tablet aspect ratio is essentially never 9:16.

### Desktop (≥1024px)
- 3-column scheme grid.
- Scheme Details becomes two-column: main content left, sticky `FarmerProfileCard` + (if applied) `ApplicationTimeline` right rail.
- Category filter becomes a static inline row, no scroll affordance.

## 10. UI States

| State | Behavior |
|---|---|
| **Default** | Matched schemes loaded, ranked by eligibility % descending |
| **Loading** | Skeleton hero + skeleton cards (shimmer), never a blank screen |
| **Empty** | "No schemes match your profile yet" + CTA to complete profile — never implies the farmer is ineligible for everything, just that data is incomplete |
| **Error** | Retry-first messaging, no raw error codes shown to farmer |
| **Applied** | `SchemeCard` and `SchemeDetails` CTA replaced with a status pill linking to `ApplicationTimeline` |
| **Approved** | Green accent treatment on card + details; benefit amount/date surfaced prominently |

## 11. Frontend Implementation Notes

**All code, styles, and assets for this feature stay inside the existing `Government equipment schemes/` folder** — no new top-level route folder, consistent with how `Insurance/` and the other feature folders are already structured in the repo.

```
Government equipment schemes/
├── Government equipment.tsx     (existing entry — becomes the Hub page,
│                                  or re-exports from index below)
├── index.tsx                    (Hub: SchemeHero + CategoryFilter + SchemeCard list)
├── SchemeDetails.tsx
├── components/
│   ├── SchemeHero.tsx
│   ├── FarmerProfileCard.tsx
│   ├── SchemeCard.tsx
│   ├── EligibilityBadge.tsx
│   ├── CategoryFilter.tsx
│   ├── DocumentChecklist.tsx
│   ├── ApplicationTimeline.tsx
│   └── VoiceButton.tsx
├── data/
│   └── schemes.mock.ts           (demo scheme dataset — name, department,
│                                   eligibility rules, documents, benefits)
├── types.ts                       (Scheme, EligibilityCriterion, DocumentItem,
│                                   ApplicationStatus types)
└── img/
    ├── 1 (1).jpeg                 (default / landscape hero background)
    └── 3.png                      (9:16 portrait hero background — see §9)
```

- **Framework:** Next.js 14+ App Router, TypeScript throughout.
- **Styling:** Tailwind CSS, pulling shared values from `styles/designTokens.css` (colors, radii, glass-blur values) so this page doesn't diverge from the dashboard's existing look.
- **Animation:** Framer Motion for card transitions, checklist stagger, and timeline stage transitions — matching the motion language already used on the dashboard/hero.
- **State:** Zustand store for the current farmer's matched-scheme list and filter state (avoids prop-drilling between Hub and Details, and lets the "applied" state persist across navigation without a refetch).
- **Forms/validation:** React Hook Form + Zod for the document-upload / mark-ready interactions in `DocumentChecklist`.
- **No backend logic in this PRD's scope** — matching, eligibility scoring, and application submission are assumed to arrive as pre-computed props/data (either mocked in `data/schemes.mock.ts` for the demo, or from `/api/schemes` per the platform's existing API surface). This document only defines what the frontend renders and how it behaves.
- **Image usage:** `1 (1).jpeg` is the default/landscape hero background across mobile-landscape, tablet, and desktop. `3.png` only replaces it when the hero container resolves to a 9:16 portrait aspect ratio, per the CSS rule in §9. Both images live under this feature's own `img/` folder and should not be duplicated elsewhere in the repo.

## 12. Design Guidelines

- **Visual language:** matches the rest of Smart Crop — green/nature gradient base, glassmorphism panels over the hero background, soft rounded corners (match existing card radius token), no hard drop shadows.
- **Tone of copy:** always "you," never "available" — "Schemes you may be eligible for," "Support for you," "You may qualify," never "Government Schemes Directory."
- **No government-portal tells:** no dense tables, no all-caps bureaucratic headers, no multi-field forms up front. Document checklist is the closest thing to a form and it's a checklist, not an input form.
- **Touch targets:** every primary action (View Details, Apply Now, Mark Ready, Listen in Odia) is a large, thumb-reachable button — never a text link as the primary CTA.
- **Trust signals:** every eligibility % is paired with the *reason* (crop match, land match, location match) directly beneath or beside it — a bare percentage without justification undermines the "why you qualify" goal of the whole feature.
- **Accessibility:** Odia voice narration and a "simple text" mode (larger font, shorter sentences, icon-first) are first-class, available from the Hero, Details, and Document Checklist screens — not a settings-menu afterthought.
