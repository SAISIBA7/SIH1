# Frontend PRD — Notifications Page
## Smart Crop — Intervention Communication Layer

**Feature type:** `[Intervene]` — MONITOR → DETECT → PREDICT → EXPLAIN → **INTERVENE** → PREVENT
**Codebase location:** `notification page/`
**Version:** 1.0 | **Status:** Draft (SIH build)

> Design system note: this PRD follows the **unified light theme** already established across the officer dashboard and the (revised) Government Schemes page — not a standalone dark/glass treatment. See §12.

---

## 1. Feature Overview

Notifications is where every other module gets a voice. Risk Engine, weather monitoring, mandi prices, the farming calendar, and Government Schemes/Insurance all funnel into this single feed — but it is not an inbox. An inbox tells you something happened. This page has to tell Ramesh three things every time, in order: **what happened, why it matters to his farm specifically, and what to do about it right now.** A notification that doesn't end in a clear next action is a notification that failed at this feature's one job.

It's the connective tissue of the intervention loop — the place a farmer lands after the system has already detected and explained a risk, right before they act on it.

## 2. User Problem

- Farmers get bombarded with generic notifications from every app they use and have learned to ignore them.
- A raw fact ("Rainfall down 35%") means nothing without the "so what" attached to their specific crop and stage.
- Different alert types (a price drop vs. a loan deadline vs. a scheme update) carry wildly different urgency, but a flat list treats them identically.
- Once a farmer sees an alert, there's often no direct path from "I saw this" to "I did something about it" — they have to leave and go hunt down the relevant page themselves.

## 3. Goals

| Goal | How the frontend proves it |
|---|---|
| Every alert answers "so what do I do" | No notification card exists without a CTA tied to a real destination (Risk Details, Crop Guide, Mandi Comparison, Schemes, Insurance) |
| Urgency is visually legible at a glance | Critical alerts use the app's one existing bold-urgency pattern (see §12), not a new color invented for this page |
| Nothing feels like email | No read/unread dot-and-list inbox metaphor — cards, not rows |
| Works for Odia-first, low-literacy users | Voice narration on every card and the detail view, not just a settings toggle |
| Closes the loop | Every action flow (§8) ends back inside the relevant feature, not stranded on Notifications |

## 4. User Persona

👨‍🌾 **Ramesh** — Mayurbhanj, Odisha · Paddy · 2.5 acres · Odia · risk score 81/100 🔴, loan due in 8 days

Ramesh doesn't browse Notifications for fun — he opens it because the bell showed a red dot, or because Smart Crop pushed him here directly off a critical alert. He needs the single most urgent thing to be unmissable in the first two seconds, everything else secondary.

## 5. Information Architecture

```
Farmer Dashboard
      │
      ├── 🔔 Notification Bell (header, badge = unread count)
      │
      ▼
🔔 NOTIFICATIONS (Hub)
      │
      ├── Hero: unread count + top critical alert + quick actions
      ├── Category Filter (Risk / Weather / Crop Activities / Market /
      │                     Government / Insurance / Officer Updates)
      ├── Notification Feed (grouped by date: Today / Yesterday / Earlier)
      │
      ▼
📄 NOTIFICATION DETAIL
      │
      ├── Alert explanation (what happened)
      ├── Reason breakdown (why — links back to Risk Engine data)
      ├── Recommended action
      └── [Take Action] → routes into the owning feature:
              Risk Alert     → Risk Details → Crop Action
              Weather Alert  → Advisory → Checklist
              Insurance      → Eligibility → Registration
              Schemes        → Scheme Details → Apply
              Market         → Mandi Comparison
              Crop Activity  → Crop Guide / Farming Calendar
```

Entry points: bell icon in every dashboard header (persistent, badge-driven), plus direct deep-links when the system pushes a critical alert (matches how Insurance/Schemes already surface proactively elsewhere in the product).

## 6. Page Wireframe Description

### 6.1 Hub — mobile (default)

```
┌─────────────────────────────────────┐
│ ← Back        Notifications          │
│                                       │
│  ┌─────────────────────────────┐    │
│  │  🔴 CRITICAL                  │    │  ← solid-black urgency card,
│  │  Your crop distress risk      │    │    same treatment as the
│  │  increased to 81/100          │    │    officer dashboard's
│  │  2 hours ago                  │    │    High Risk Farmers card
│  │            [View Risk Details]│    │
│  └─────────────────────────────┘    │
│                                       │
│  8 unread · 3 need action             │
│  🔊 Listen to today's summary         │
├─────────────────────────────────────┤
│ [All][Risk][Weather][Crop][Market]…  │  ← horizontally
│                                       │    scrollable chips
├─────────────────────────────────────┤
│ TODAY                                 │
│ ┌─────────────────────────────────┐ │
│ │ 🌧️ Weather · Warning              │ │
│ │ Heavy rainfall expected tomorrow  │ │
│ │ 5 hours ago      [View Advisory→]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📅 Crop Activity · Info           │ │
│ │ Soil inspection due today         │ │
│ │ Today           [Open Crop Plan→]│ │
│ └─────────────────────────────────┘ │
│                                       │
│ YESTERDAY                             │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Market · Warning                │ │
│ │ Paddy price decreased 8%          │ │
│ │ Yesterday      [Compare Mandis →]│ │
│ └─────────────────────────────────┘ │
│                                       │
│              [🏠][🌱][📊][💰][More●]│
└─────────────────────────────────────┘
```

### 6.2 Notification Detail

```
┌─────────────────────────────────────┐
│ ← Back                                │
│                                       │
│ 🌧️ WEATHER · WARNING                  │
│ Heavy rainfall expected tomorrow      │
│ 5 hours ago                           │
│                                       │
│ WHAT THIS MEANS                       │
│ 65mm of rain is forecast for          │
│ Mayurbhanj tomorrow. Your paddy is    │
│ in vegetative stage — this raises     │
│ waterlogging risk given already-low   │
│ soil drainage this week.              │
│                                       │
│ WHY YOU'RE SEEING THIS                │
│ ✓ Your district — Mayurbhanj forecast │
│ ✓ Your crop stage — vegetative        │
│ ✓ Current soil moisture — already low │
│                                       │
│ RECOMMENDED ACTION                    │
│ Check field drainage today before     │
│ rainfall arrives.                     │
│                                       │
│ 🔊 Listen in Odia                     │
│                                       │
│           [OPEN WEATHER ADVISORY]     │
└─────────────────────────────────────┘
```

### 6.3 Empty / Loading / Error

```
No notifications:           Error:
┌─────────────────────┐    ┌─────────────────────┐
│  🔔                   │    │  ⚠️                  │
│  You're all caught up│    │  Couldn't load        │
│  Nothing needs your   │    │  notifications         │
│  attention right now  │    │  [Retry]               │
└─────────────────────┘    └─────────────────────┘
```

## 7. Component Breakdown

All components live in `notification page/` (see §11 for file layout).

### `NotificationHeader`
- **Purpose:** Page title, back nav, unread badge.
- **Props:** `unreadCount`, `onBack`
- **States:** default · zero-unread (badge hidden)
- **Responsive:** identical structure across breakpoints; desktop adds a "Mark all as read" action inline.

### `PrioritySummary`
- **Purpose:** The hero — surfaces the single most critical unresolved alert plus a quick unread/action-needed count. This is the "so what should I look at first" answer.
- **Props:** `topCriticalAlert?`, `unreadCount`, `actionNeededCount`, `onViewCritical`, `onListenSummary`
- **States:** has-critical (solid-black urgency treatment, §12) · no-critical (quieter summary, no black card) · loading
- **Responsive:** stacked (mobile) → critical alert and counts side-by-side (desktop)

### `CategoryFilter`
- **Purpose:** Filter chips — Risk Alerts, Weather, Crop Activities, Market, Government, Insurance, Officer Updates.
- **Props:** `categories[]`, `activeCategory`, `onChange`
- **States:** default · active-chip · empty-category (grayed, not hidden — same pattern as Schemes' `CategoryFilter`, for consistency)
- **Responsive:** horizontal scroll (mobile/tablet) → static inline row + becomes a left side-rail filter panel on desktop per the PRD's desktop requirement

### `NotificationCard`
- **Purpose:** Single alert summary in the feed.
- **Props:** `category`, `priority ('critical'|'warning'|'info')`, `title`, `description`, `timestamp`, `ctaLabel`, `ctaHref`, `isRead`
- **States:** unread (left accent bar + bold title) · read (no accent, muted title weight) · critical (solid-black card, overrides normal card styling entirely — see §12) · warning (amber left accent) · info (neutral)
- **Responsive:** full-width stacked (mobile) → 2-col grid (tablet) → single-column feed with wider cards on desktop (a dense multi-column notification grid reads as noisy, unlike scheme cards which are genuinely parallel options)

### `NotificationDetail`
- **Purpose:** Container for the full detail view — explanation, reason breakdown, recommended action, CTA.
- **Props:** `notification` (full object incl. linked risk/weather/market data), `onTakeAction`
- **States:** default · action-taken (CTA replaced with confirmation + link to destination page)
- **Responsive:** single column (mobile) → two-column on desktop, with a compact `TimelineGroup` context rail showing recent related alerts (e.g. the risk trend that led here)

### `PriorityBadge`
- **Purpose:** Small inline label — Critical / Warning / Info.
- **Props:** `priority`, `size ('sm'|'lg')`
- **States:** critical · warning · info — no "unread" variant, that's handled by `NotificationCard`'s own state, not the badge
- **Responsive:** none needed — same component at both sizes

### `ActionButton`
- **Purpose:** The CTA that routes a notification into its owning feature. Shared, not rebuilt per category.
- **Props:** `label`, `href`, `variant ('primary'|'quiet')`
- **States:** default · loading (brief, while route resolves) · disabled (rare — e.g. scheme already applied)
- **Responsive:** full-width (mobile) → auto-width inline (desktop)

### `TimelineGroup`
- **Purpose:** Date-grouping wrapper (Today / Yesterday / Earlier) for the feed, and the "related alerts" rail on desktop detail view.
- **Props:** `label`, `children`
- **States:** n/a — purely structural
- **Responsive:** sticky group label on scroll (mobile), same but non-sticky on desktop where the feed is shorter per viewport

### `VoiceButton`
- **Purpose:** Reused as-is from the Government Schemes feature (same component, don't rebuild) — reads hero summary or detail-view content aloud in Odia/Hindi/English.
- **Props:** `textToRead`, `language`, `isPlaying`, `onToggle`
- **States:** idle · playing · unavailable
- **Responsive:** fixed 44px+ tap target at all sizes

### `BottomNavigation`
- **Purpose:** Shared platform nav, reused unmodified.
- **Props:** `activeTab`
- **Responsive:** mobile/tablet only, hidden on desktop shell nav.

## 8. Interaction Design

- **Bell → Hub:** tapping the header bell navigates straight to the Hub; if there's exactly one unread critical alert, consider deep-linking directly to its detail view instead of the hub — fewer taps between "something's wrong" and "I understand what."
- **Card → Detail:** same shared-element expand motion as Schemes' `SchemeCard → SchemeDetails` transition (Framer Motion `layoutId`) — this page should feel like the same product as Schemes, not a different app bolted on.
- **Marking read:** opening a card's detail view marks it read automatically; no separate "mark as read" tap required for the primary flow (desktop can offer a bulk "mark all read" as a secondary affordance).
- **Category filter:** client-side filter over the already-fetched notification list, quick fade/slide, no reload — identical pattern to Schemes.
- **Action flows** (per the PRD's required flow examples):
  - Risk Alert → Notification → Risk Details → Crop Action
  - Weather → Notification → Advisory → Checklist
  - Insurance → Notification → Eligibility → Registration
  Each of these is a real navigation, not a modal — the farmer should land inside the actual feature page, with back navigation returning to the notification detail, not the hub (preserves context if they came from a specific alert).
- **Voice:** reads the current view's content in chunks — hero summary on the hub, explanation + action on detail — same short-chunk principle as Schemes' `VoiceButton` usage.

## 9. Responsive Behavior

### Mobile (default, <768px)
- Single-column card feed, bottom nav visible, ≥44px tap targets.
- Category filter is a horizontally scrollable chip row.
- Background image: this page's ambient background uses the same **full-viewport, low-opacity, inset-shell** pattern established for the rest of the app (§12) — not a full-bleed hero photo. `img/1(1).png` is the default ambient background; `img/3.png` swaps in when the container resolves to a 9:16 portrait aspect ratio, via the same CSS `aspect-ratio` media query pattern used on Schemes:
  ```css
  .notifications-bg { background-image: url('/notification-page/img/1(1).png'); }
  @media (aspect-ratio: 9/16), (max-aspect-ratio: 9/16) {
    .notifications-bg { background-image: url('/notification-page/img/3.png'); }
  }
  ```

### Tablet (768–1023px)
- `NotificationCard` moves to a 2-column grid where category allows (critical alerts always render full-width regardless of grid, so they can't be visually demoted by column placement).

### Desktop (≥1024px)
- Category filter becomes a left side-rail (per the PRD's desktop requirement for side filters), feed occupies the main column, single-column (not multi-column) since notifications are sequential/time-based, not parallel options like scheme cards.
- Notification Detail gains a right rail showing `TimelineGroup` of related recent alerts.

## 10. UI States

| State | Behavior |
|---|---|
| **Default** | Feed loaded, grouped by date, critical alerts pinned to top of `PrioritySummary` regardless of date grouping below |
| **Loading** | Skeleton hero + skeleton cards, never a blank screen |
| **Empty** | "You're all caught up" — calm, positive framing, not a dead-end |
| **Error** | Retry-first, no raw error codes |
| **Unread** | Left accent bar, bold title, contributes to header badge count |
| **Read** | No accent bar, normal title weight |
| **Critical** | Solid-black card treatment (§12) — cannot be missed, cannot be confused with a warning-level card |

## 11. Frontend Implementation Notes

**All code, styles, and data for this feature stay inside the existing `notification page/` folder** — matching how you've scoped Government Schemes, Insurance, and the other feature folders.

```
notification page/
├── notificationpage.tsx        (existing entry — becomes the Hub page,
│                                 or re-exports from index below)
├── index.tsx                   (Hub: PrioritySummary + CategoryFilter + feed)
├── NotificationDetail.tsx
├── store.ts                    (Zustand: notification list, filter,
│                                 read/unread state)
├── types.ts                    (Notification, PriorityLevel, Category,
│                                 NotificationAction types)
├── components/
│   ├── NotificationHeader.tsx
│   ├── PrioritySummary.tsx
│   ├── CategoryFilter.tsx        (or import/share the one from
│   │                               Government equipment schemes/ if it's
│   │                               already generic — check before duplicating)
│   ├── NotificationCard.tsx
│   ├── PriorityBadge.tsx
│   ├── ActionButton.tsx
│   ├── TimelineGroup.tsx
│   └── VoiceButton.tsx           (share the existing one from
│                                   Government equipment schemes/ — do not
│                                   rebuild, this component is already generic)
├── data/
│   └── notifications.mock.ts   (demo dataset covering all 7 categories)
└── img/
    ├── 1(1).png                 (already exists — default ambient background)
    └── 3.png                    (already exists — 9:16 portrait swap)
```

- **Framework/styling/state:** Next.js 14+ App Router, TypeScript, Tailwind pulling from `styles/designTokens.css`, Zustand, Framer Motion — identical stack to every other feature, no new dependencies.
- **Icons:** `lucide-react` only. No emoji as UI icons anywhere in this feature (Bell, AlertTriangle for critical, CloudRain for weather, Sprout for crop activity, TrendingDown/TrendingUp for market, Landmark for government, ShieldCheck for insurance, UserCheck for officer updates).
- **Component reuse over duplication:** `VoiceButton` and possibly `CategoryFilter` already exist in `Government equipment schemes/`. Check those files before writing new ones — if they're already category-agnostic, import/share rather than fork. Duplicated components are exactly how a codebase ends up with the kind of inconsistency already flagged on Schemes/Dashboard.
- **No backend integration in scope** — mock data and a mocked read/unread + action-taken state are sufficient for this stage, same as Schemes.
- **Bell integration:** the header bell that links here lives in the dashboard's existing header component, not in this folder — that's a one-line addition to an existing file (link + badge count), not new code owned by this feature.

## 12. Design Guidelines

This section carries the design-system decisions made while correcting Government Schemes and the officer dashboard — Notifications should launch already consistent with them, not need its own correction pass later.

- **One accent color, sourced from `styles/designTokens.css`** — the sage/olive already used for the sidebar's active state and (after revision) Schemes' eligibility/CTA elements. Do not introduce a new green, teal, or lime for this page.
- **One bold-urgency pattern, reused, not reinvented.** The officer dashboard's solid-black "High Risk Farmers" card is the app's one deliberate high-contrast moment. Critical notifications should use that exact same solid-black-card treatment — not a new red alert box, not an orange banner. A second, unrelated "loud" visual language for urgency here would recreate the same inconsistency already fixed on Schemes.
- **Framed shell, not full-bleed photo.** Background image sits as a blurred, low-opacity ambient layer behind an inset, rounded, near-opaque content shell — same structure as the dashboard and revised Schemes page, using this feature's own `img/1(1).png` / `img/3.png` per the aspect-ratio rule in §9.
- **Card discipline.** Static/explanatory text (the "What This Means" block in Notification Detail) does not need a bordered card — let it sit directly on the shell background. Reserve elevated-card treatment for scannable, discrete units: individual notifications in the feed, the reason-breakdown checklist, the action CTA area.
- **Icons:** `lucide-react`, one stroke weight, one size scale, no emoji — see §11.
- **Copy tone:** plain and specific, never alarmist for its own sake. "Heavy rainfall expected tomorrow" not "⚠️ URGENT WEATHER WARNING!!". Severity is communicated by the priority system and the black-card treatment, not by punctuation or all-caps.
- **Accessibility:** Odia (and Hindi/English) voice narration is available from both the hub summary and every detail view — first-class, not a settings-menu afterthought, matching the standard already set on Schemes.
