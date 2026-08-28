# Product Requirements Document
## Smart Crop — Agriculture Officer Dashboard (Command Center)

**Parent Product:** Smart Crop — Agricultural Distress Early-Warning Platform (PS-02)
**Scope of this document:** Officer-facing surface only. Frontend only, mock data, no backend build in this phase.
**Version:** 1.0 | **Status:** Draft (Hackathon Build)

---

## 1. Why This Document Exists

The master Smart Crop PRD covers the whole platform — farmer app, officer dashboard, bank/insurer portal, government portal. This document pulls out **only the Agriculture Officer surface** and specifies it in enough detail to build directly, without re-deriving decisions already made upstream (tech stack, data model, distress-loop philosophy). Anything not restated here inherits from the master PRD.

---

## 2. Problem Statement

An agriculture officer is not responsible for one farmer — they're responsible for hundreds to thousands across a district. Today, distress signals (weather, market, financial) surface too late and with no way to triage: every farmer looks the same in a spreadsheet until something has already gone wrong. Officers end up reacting to crises instead of intervening before them, and even when they want to act, they have no ranked, explained view of **who** needs attention first and **why**.

## 3. Positioning

> **Not:** a farmer-records CRM or a generic admin panel bolted onto a database.
> **Is:** a distress command center — it triages, explains, and routes officers to action.

Every element on this dashboard should answer one of:

```
MONITOR → DETECT → EXPLAIN → INTERVENE → PREVENT
```

If a screen or component doesn't serve one of those five verbs, it doesn't belong on this dashboard.

## 4. Goals & Demo Success Metrics

| Goal | Metric |
|---|---|
| Officer can triage instantly | High/medium/low risk counts and a ranked priority list visible with zero clicks after login |
| Risk is explainable, not a black box | Every farmer row and detail view shows *why* they're at risk, not just a number |
| Officer can act in one flow | Call / SMS / Assign Visit reachable in ≤2 clicks from any farmer |
| District-level pattern recognition | Map + analytics make risk *concentration* visible, not just a list |
| Feels premium, not bureaucratic | First impression reads as "AI-powered command center," not "government portal" |

## 5. Persona

**🧑‍🌾 Agriculture Officer**
- Monitors one district (e.g. Mayurbhanj) with 1,000+ registered farmers
- Primarily desktop-based (office), occasionally tablet in the field
- Needs speed over depth — scans, prioritizes, acts, moves on
- Not deeply technical; the UI must read at a glance, not require training
- Success = fewer farmers slipping into severe distress unnoticed

## 6. Design Language

The visual system is defined by the supplied reference image (a marketing site called "hecta" for smart-drone agriculture) and must be carried through consistently — sidebar, header, cards, modals, charts.

**Reading of the reference:**
- Soft, light neutral base (off-white → light warm-gray, roughly `#F2F2EF` → `#E7E7E2`) rather than pure white or dark mode
- Glassmorphic panels: translucent white (~`rgba(255,255,255,0.55–0.7)`), backdrop-blur, hairline `1px` light border, large radius (`24–32px`), soft diffuse shadow (no hard edges)
- One **solid, near-black "focus" card** (`#1A1A1A`–`#1E1E1E`) used sparingly to make one specific data point pop against all the glass — this is the pattern to reuse for the single most urgent stat (High Risk count)
- Single accent color: a muted lime-olive (`#CBE05F`–`#D6E67A` range) — used **only** for one primary action or one highlighted metric per screen, never as a base color
- Typography: clean geometric/grotesk sans-serif, light-weight large headlines, generous letter-spacing, muted gray secondary text (`#8C8C88`)
- Small stat "pills" — compact rounded-rectangle chips, bold number on top, muted caption underneath (mirrors the "6 Fields/day · 9 Drones Active · 10 Regions" pattern)
- Circular avatar with a small colored presence/status dot
- Nav treated as pill segments — active state is a solid dark pill, inactive items are plain text, not boxed
- Generous whitespace and breathing room; nothing feels dense or spreadsheet-like even where the data is dense

**The background image is the page background — full-bleed, not confined:** in the reference, the grass photograph fills the entire viewport edge-to-edge, and every piece of content (nav, headline, stat chips, the dark callout card) floats on top of it as a glass or solid panel. That is the actual pattern to replicate — not a "hero section" to be shrunk down or boxed off. Implementation:
- The background image is fixed/cover positioned behind the **entire page** — sidebar, header, and main content area all sit on top of the same continuous image, not on a plain gray page background
- Every panel (stat cards, Priority Farmers, Distress Map, Analytics, Alerts) is a translucent glass card floating over that image — this is what makes the glass effect actually visible; glass over a flat gray background looks like nothing, glass over the photograph is what creates the effect
- Legibility comes from the glass treatment itself (`rgba(255,255,255,0.6)` + `blur(20px)` + sufficient text contrast on top), not from removing the image — increase panel opacity/blur if a specific area is hard to read, don't strip the image out from behind it
- The one solid near-black focus card (High Risk stat) reads as dark against the image the same way it does in the reference — keep that contrast intentional

**Content vs. visual language — do not confuse the two:**

The reference image is a marketing site for an unrelated product ("hecta," smart drones). It must be treated as a **style reference only**. Antigravity should:

- **Reuse exactly:** the background photography, glass-panel treatment (blur/opacity/border), the solid dark focus-card pattern, the lime accent color, corner radii, shadow softness, typography scale/weight, the pill-shaped nav/chip treatment, and overall spacing rhythm
- **Never reuse:** any of the reference image's actual text, labels, or numbers — "hecta," "Smart drones for scanning, spraying, and precision farming," "About / Advantages / Home / All drones / Indicators," "32% / Reduced pesticide usage," "6 Fields/day," "Explore Solutions," etc. None of this is Officer Dashboard content; it's placeholder copy from a different product and must not appear anywhere in the build.

All real content — nav items, headings, stats, labels — comes from Section 7 (Information Architecture) and Section 8 (Screen Specifications) of this PRD: "Agricultural Distress Command Center," "Mayurbhanj District," the High/Medium/Low Risk Farmer counts, "Priority Farmers," Ramesh/Suresh/Anita, etc.

**Reference asset (use the actual file, not a re-creation):**

The provided reference image is checked into the project at:

```
Agriculture officer dashboard/img/1 (1).jpeg
```

Antigravity should treat this file as the literal source of truth for the theme — colors, blur, card shapes, spacing — not just a mood reference to eyeball once. Two implementation notes:

- **Rename the file before importing it anywhere.** The current name (`1 (1).jpeg`) has a space and parentheses, which breaks or silently mis-resolves in `next/image` static imports and in public-folder URL paths on some setups. Rename to something like `hero-background.jpeg` first, then use it.
- **Where to use it:** per the adaptation note above, this image (or a blurred/cropped slice of it) belongs behind the sidebar footer, header band, and empty/loading states — as a photographic wash, not behind the data-bearing panels (stat cards, tables, charts, map).

Example (Next.js static import, once renamed and colocated with the component):

```tsx
import heroBackground from "./img/hero-background.jpeg";
import Image from "next/image";

<Image
  src={heroBackground}
  alt=""
  fill
  className="object-cover object-bottom -z-10"
  priority
/>
```

If instead it's placed under `/public/img/hero-background.jpeg`, reference it as a plain string path — `/img/hero-background.jpeg` — rather than a static import.

**Design tokens (for implementation):**

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#F2F2EF` | Page background |
| `--glass-panel` | `rgba(255,255,255,0.6)` + `backdrop-filter: blur(20px)` | Cards, sidebar, modals |
| `--glass-border` | `rgba(255,255,255,0.7)` | 1px panel borders |
| `--focus-dark` | `#1A1A1A` | High-priority stat card, risk score display |
| `--accent-lime` | `#CFE362` | Primary CTA, one highlighted metric per screen |
| `--text-primary` | `#1A1A1A` | Headlines |
| `--text-secondary` | `#8C8C88` | Captions, labels |
| `--radius-lg` | `28px` | Panels, cards |
| `--radius-md` | `16px` | Chips, badges, buttons |
| `--shadow-soft` | `0 8px 24px rgba(0,0,0,0.06)` | All elevated panels |
| Risk red | `#E4574B` | High risk indicators |
| Risk yellow | `#F0B942` | Medium risk indicators |
| Risk green | `#6FBF73` | Low risk indicators |

---

## 7. Information Architecture

```
LOGIN → 🚨 COMMAND CENTER (default landing view)
  │
  ├── 🚨 High-Risk Farmers ──→ Farmer Detail Panel
  ├── 🗺️ Distress Map (full page)
  ├── 📊 Analytics
  ├── 🔔 Alerts
  ├── 📇 Farmer Database
  ├── 🕓 Intervention History
  └── ⚙️ Settings
```

Sidebar items (per build spec): Smart Crop logo, Command Center, High Risk Farmers, Distress Map, Analytics, Alerts, Farmer Database, Intervention History, Settings.

---

## 8. Screen Specifications

### 8.1 Login → Landing Transition
- Authentication itself is **out of scope for this document** and owned by the separate *Unified Agriculture Authentication Gateway* PRD — a single login shared by farmers and officers, with its own visual identity (warm off-white, botanical/forest-green artwork, organic curve divider). It intentionally does **not** carry this dashboard's glass/lime/grass theme, and it shouldn't.
- Role is never decided by the frontend: Supabase-backed auth resolves the officer's identity server-side, and only a backend-verified officer is routed here.
- On successful, verified login, the officer lands directly on the Command Center — no intermediate "welcome" screen, and no theme "handoff" moment to design for since the two surfaces are deliberately distinct experiences (shared front door → distinct dashboards).

### 8.2 Command Center (Main Dashboard)

**Header**
- Title: "Agricultural Distress Command Center"
- Subtitle: current district, e.g. "Mayurbhanj District"
- Right-aligned: search, notification bell (with badge count), district selector, officer profile (avatar + name)

**Top Statistics Cards** (4 cards, horizontal row)
| Card | Example value | Treatment |
|---|---|---|
| High Risk Farmers | 17 | Solid dark focus card, red accent icon, most visually dominant |
| Medium Risk Farmers | 34 | Glass card, yellow accent icon |
| Low Risk Farmers | 128 | Glass card, green accent icon |
| Total Farmers Monitored | 1,248 | Glass card, neutral icon |

Each card: icon, trend indicator (↑/↓ vs. last period), animated count-up on load, hover lift (translateY + shadow deepen).

**Priority Farmers** (primary table/card, largest section on the page)

Title: "Priority Farmers" — sorted by risk score descending.

| Farmer | Crop | Risk Score | Location | Risk Reason | Loan Status | Action |
|---|---|---|---|---|---|---|
| Ramesh | Paddy | 81/100 🔴 | Mayurbhanj | Rainfall ↓35% | Loan due in 8 days | ⋯ |
| Suresh | Paddy | 76/100 🔴 | Mayurbhanj | Rainfall risk | — | ⋯ |
| Anita | Maize | 71/100 🔴 | Mayurbhanj | Price decline | — | ⋯ |

Each row: risk badge (colored pill matching risk tier), crop badge, and an action menu with **View Details / Call Farmer / Send SMS / Assign Visit**. Row click opens the Farmer Detail Panel. "View All" leads to the full Farmer Database.

**Distress Map (embedded preview)**
- Compact district map placeholder with colored markers (red/yellow/green) showing farmer clusters and risk zones
- "Expand" action routes to the full Distress Map page

**Alerts Panel (sidebar or bottom strip)**
- Real-time alert cards, e.g.:
  - "17 farmers crossed high-risk threshold"
  - "Heavy rainfall expected tomorrow"
  - "Paddy prices decreased in nearby mandis"
- Each alert: icon, one-line text, relative timestamp, dismiss/view action

### 8.3 Farmer Detail Panel (modal or slide-over)

Opened from any farmer row.

- **Profile:** Name, Village, District, Land Area, Current Crop, Sowing Date
- **Risk Score:** large display, e.g. `81/100` — rendered in the solid dark focus-card style, "HIGH RISK" label
- **Risk Breakdown** (stacked bars):
  - Weather Risk — 32/40
  - Market Risk — 29/40
  - Financial Risk — 20/20
- **Reasons** (bulleted, plain language):
  - Rainfall 35% below normal
  - Soil moisture critically low
  - Paddy price decreased 22%
  - Loan due in 8 days
- **Recommended Intervention** (cards): Field Inspection, Insurance Registration, Alternative Crop Assessment
- **Actions:** CALL FARMER · SEND SMS · ASSIGN FIELD VISIT (primary buttons, lime accent on the top-priority action)

### 8.4 Distress Map (full page)
- Larger district map, same marker/cluster/zone logic as the embedded preview
- Filter by risk tier, crop type, or block/village
- Clicking a cluster or marker surfaces a mini farmer list for that area, which opens the Farmer Detail Panel on selection

### 8.5 Analytics
- **Risk Trend:** line chart, e.g. `60 → 67 → 72 → 81` (district-average or selected-farmer trend)
- **District Risk Distribution:** pie/bar chart of high/medium/low counts
- **Crop Risk Breakdown:** per-crop risk tier, e.g. Paddy → High, Maize → Medium, Groundnut → Low
- All charts built with Recharts, animated on load (staggered draw-in, not instant render)

### 8.6 Alerts (full page)
- Chronological, filterable feed of all system alerts (risk threshold crossings, weather warnings, market moves)
- Same alert-card visual language as the dashboard panel, just more of them, with read/unread state

### 8.7 Farmer Database
- Full searchable/sortable/filterable table of all monitored farmers (the "View All" destination from Priority Farmers)
- Filters: risk tier, crop, village/block, loan status
- Must handle 1,000+ rows without jank (virtualized list/table)

### 8.8 Intervention History
- Log of past actions taken per farmer: call made, SMS sent, visit assigned/completed, outcome notes
- Useful for judges as proof the loop actually closes (MONITOR → … → PREVENT)

### 8.9 Settings
- Officer profile, district assignment, notification preferences — kept minimal; not a demo priority

---

## 9. Components Required

- `Sidebar`
- `Header`
- `RiskSummaryCards`
- `FarmerRiskTable`
- `DistressMap`
- `RiskAnalyticsCharts`
- `FarmerDetailPanel`
- `AlertPanel`
- `InterventionModal`

---

## 10. Data Shape (mock, TypeScript)

Scoped subset of the master PRD's Prisma model, shaped for frontend mock data:

```ts
interface Farmer {
  id: string;
  name: string;
  village: string;
  district: string;
  landAreaAcres: number;
  crop: string;
  sowingDate: string; // ISO date
  loanAmount?: number;
  loanDueDate?: string;
  latestRisk: RiskScore;
}

interface RiskScore {
  score: number;        // 0–100
  tier: "high" | "medium" | "low";
  weatherRisk: number;   // /40
  marketRisk: number;    // /40
  financialRisk: number; // /20
  reasons: string[];
  trend: number[];       // e.g. [60, 67, 72, 81]
}

interface Alert {
  id: string;
  type: "risk" | "weather" | "market" | "activity";
  message: string;
  timestamp: string;
  read: boolean;
}

interface Intervention {
  id: string;
  farmerId: string;
  type: "call" | "sms" | "visit";
  status: "pending" | "completed";
  notes?: string;
  createdAt: string;
}
```

Seed the mock set around the same demo farmers as the master PRD (Ramesh/Suresh/Anita, Mayurbhanj district, the 81/76/71 risk scores) so the officer dashboard and farmer-app demo tell one continuous story.

---

## 11. Interaction & Motion Spec (Framer Motion)

- **Stat cards:** hover → lift 2–4px + shadow deepen; value counts animate up from 0 on mount
- **Priority Farmers table:** rows fade/slide in with a slight stagger on load or filter change
- **Sidebar:** collapsed/expanded transition is a smooth width + opacity tween, not an instant snap
- **Farmer Detail Panel:** slide-over from the right (or scale-fade if modal), backdrop blur increases on open
- **Charts:** animate in on mount (line draw, bar grow) — no static instant-render charts
- **Alerts:** new alerts enter with a subtle slide-down + highlight flash, then settle

---

## 12. Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| State | Zustand (if needed) |
| Animation | Framer Motion |
| Data | Mock JSON — no backend in this phase |

---

## 13. Non-Functional Requirements

- **Performance at scale:** Farmer Database and Priority Farmers list must stay smooth with 1,000+ mock rows (virtualize long lists)
- **Legibility over aesthetics:** glass panels must maintain sufficient contrast for risk badges and body text — don't let translucency compromise readability of the highest-stakes information on the page
- **Responsive:** desktop-first, but should not visibly break at laptop widths (~1366px) since that's the likely demo hardware
- **Explainability:** no risk score anywhere without its contributing factors shown or one click away

---

## 14. Out of Scope (this phase)

- Backend / real data integration (weather, mandi, NDVI APIs)
- Authentication logic beyond a themed login screen
- Real map tiles / GIS — a stylized placeholder map is sufficient
- Bank/Insurer and Government dashboards (separate surfaces, separate scope)
- Payment or live SMS/voice dispatch — UI affordances only

---

## 15. Definition of Done (Demo Criteria)

The Officer Dashboard is demo-ready when a judge can, without narration:
1. Land on Command Center and immediately see how many farmers are high/medium/low risk
2. Open the Priority Farmers list and understand *why* the top farmer is flagged
3. Click into a farmer and see a full, explained risk breakdown plus one-click Call/SMS/Assign actions
4. Glance at the Distress Map and Analytics and understand district-level concentration, not just individual cases
5. Come away describing it as "an AI-powered agricultural command center" — not "a dashboard with a farmer table"
