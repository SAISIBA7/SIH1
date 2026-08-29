# Smart Crop — Notifications Backend PRD

**Scope:** Backend for the Notifications feature ONLY (`notification page/` frontend). No other Smart Crop feature is redesigned here. Existing entities from the main Smart Crop schema (Farmer, RiskScore, Crop, MandiPrice, Insurance, Scheme, Booking) are referenced, not redefined.

**Stack:** Next.js 14+ Route Handlers, TypeScript, Prisma, PostgreSQL (Supabase/Neon), Upstash Redis (counters/cache), Bhashini (TTS), Twilio/MSG91 (SMS), GitHub Actions (cron for risk/weather polling that triggers notifications).

---

## 1. Backend Objective

The Notifications backend is a **read-optimized, event-driven fan-in service**. Every other Smart Crop module (Risk Engine, Weather, Mandi, Crop Calendar, Insurance, Schemes, Officer actions) emits an **event**; the Notification Service turns qualifying events into a `Notification` row, classifies its priority, attaches a backend-defined action, and makes it available to the frontend through a small, fast API surface (list, detail, summary, read-state, action, related). Delivery (SMS/voice/push) is a side effect of creation, never a prerequisite for it — in-app always wins even if external delivery fails.

Everything the frontend currently infers or would otherwise compute client-side (priority, "so what", CTA destination, unread/action-needed counts) is computed and owned by the backend.

---

## 2. Frontend Requirements Recap (source of truth)

| Frontend piece | Data it needs from backend |
|---|---|
| `NotificationCard` | category, priority, title, description, timestamp, ctaLabel, ctaHref, isRead |
| `PrioritySummary` | topCriticalAlert, unreadCount, actionNeededCount |
| `NotificationDetail` | what happened, why you're seeing this (reason breakdown), recommended action, CTA, related notifications |
| `VoiceButton` | textToRead (in farmer's language), language |
| Category filter chips | fixed 7-category enum |
| Mark-all-as-read (desktop) | bulk read endpoint scoped to the authenticated user |

The backend must never let the frontend compute priority, decide a CTA destination, or assemble "why you're seeing this" from raw feature data — all of that ships pre-computed in the API response.

---

## 3. Notification Categories

Exactly seven, fixed by product requirement (not open to farmer or officer customization):

```
RISK
WEATHER
CROP_ACTIVITY
MARKET
GOVERNMENT
INSURANCE
OFFICER_UPDATE
```

**Decision: Prisma/PostgreSQL native enum, not string + validation.**

Rationale: the category list is closed, product-defined, and referenced in indexes, RBAC rules, and per-category business logic (§19–§25). A native enum gives:
- Compile-time exhaustiveness checking in TypeScript (`switch` on category without a `default` case will fail to compile if a category is added and not handled).
- A DB-level constraint with zero extra validation code.
- Cheaper index storage than `VARCHAR`.

Trade-off accepted: adding an 8th category later requires a Prisma migration (`ALTER TYPE ... ADD VALUE`), which is safe and low-cost in Postgres and not a concern for a hackathon MVP or near-term roadmap. If category ownership were expected to move to non-engineering hands (e.g. an admin CMS), string + validation would be preferable — that's not the case here.

---

## 4. Priority Levels

```
CRITICAL
WARNING
INFO
```

**The backend owns priority classification. The frontend never sets or infers priority.**

| Priority | Backend rule (evaluated at notification-creation time) |
|---|---|
| `CRITICAL` | Risk score crosses ≥70 threshold (see §19) · Severe disaster warning (cyclone/flood/heatwave with IMD severity = high) · Any intervention the Risk Engine or an officer explicitly flags as immediate-action-required |
| `WARNING` | Weather risk below disaster severity but still advisory-worthy (e.g. heavy rainfall, waterlogging risk) · Market price drop beyond a configurable % threshold · Upcoming deadline within N days (loan due, scheme deadline, insurance registration window) |
| `INFO` | Routine crop activity (today's calendar task) · Scheme update/new match with no imminent deadline · General officer message with no required action |

Priority is computed once, in `NotificationRuleEngine`, at creation time, using rules per category (§19–§25), and stored on the row. It is **not** recomputed on read — if underlying conditions change (e.g. risk drops back below threshold), a new notification event fires; the old notification's priority is left as a historical record.

---

## 5. Database Design

### 5.1 `Notification` (new)

| Field | Type | Explanation |
|---|---|---|
| `id` | `String @id @default(cuid())` | Opaque, non-guessable primary key. Never expose sequential integer IDs (IDOR surface). |
| `farmerId` | `String` (FK → `Farmer.id`) | Owning farmer. Every query is scoped by this field — see §31. |
| `category` | `NotificationCategory` enum | One of the 7 fixed categories (§3). |
| `priority` | `NotificationPriority` enum | `CRITICAL` \| `WARNING` \| `INFO`, backend-computed (§4). |
| `title` | `String` | Short headline, already localized (§29), e.g. "Heavy rainfall expected tomorrow." |
| `description` | `String` | One-line summary shown on the card. Localized. |
| `body` | `Json` | Structured detail payload: `{ whatHappened, whyReasons: string[], recommendedAction }` — powers `NotificationDetail` without the frontend reassembling prose from multiple fields. Localized. |
| `voiceText` | `String` | Full narration text for TTS, may differ slightly from `title`/`description`/`body` (more conversational). Localized. |
| `language` | `String` (`or`, `hi`, `en`) | Language this row's text is rendered in — see §29 for why this is per-row, not per-request. |
| `isRead` | `Boolean @default(false)` | See §6 for why this lives directly on the row. |
| `readAt` | `DateTime?` | Audit trail — when it was read, not just whether. |
| `actionStatus` | `NotificationActionStatus` enum | `NOT_REQUIRED` \| `REQUIRED` \| `IN_PROGRESS` \| `COMPLETED` \| `EXPIRED` — see §7 state machine. |
| `actionType` | `String` | Symbolic action key, e.g. `VIEW_RISK_DETAILS`, `OPEN_ADVISORY`, `OPEN_INSURANCE_ELIGIBILITY`. Maps to a backend-owned registry (§8), not a raw URL. |
| `actionLabel` | `String` | Localized CTA copy, e.g. "View Risk Details". |
| `sourceFeature` | `NotificationSourceFeature` enum | Which module produced this: `RISK_ENGINE`, `WEATHER`, `MANDI`, `CROP_CALENDAR`, `INSURANCE`, `SCHEMES`, `OFFICER`. Used for authorization checks on the linked entity. |
| `sourceEntityId` | `String` | ID of the entity in the owning feature (e.g. `RiskScore.id`, a weather-alert ID, `Scheme.id`). The backend re-validates this belongs to `farmerId` before returning the action target — see §8. |
| `correlationId` | `String` | Groups notifications that belong to the same underlying situation over time (e.g. every risk notification for one farmer's ongoing distress episode shares a correlation ID) — powers "related alerts" (§17) without a join table. |
| `dedupeKey` | `String` | Deterministic key derived from `(sourceFeature, sourceEntityId, category, "milestone")` — e.g. `RISK:farmer123:threshold_crossed:81`. Enforced unique — see §26. |
| `expiresAt` | `DateTime?` | Nullable. Set for time-bound categories (weather, some market alerts); null for permanent record categories (risk history, officer updates, insurance status changes) — see §27. |
| `createdAt` | `DateTime @default(now())` | |
| `updatedAt` | `DateTime @updatedAt` | |

Design notes:
- `body` is `Json` rather than three separate `TEXT` columns because the shape of "why you're seeing this" varies slightly by category (a list of 2–4 reason strings) and a single structured blob is simpler for the Detail API to pass straight through without reassembly, while still being fully typed on the TypeScript side via `NotificationBody` (§37 types).
- No separate `NotificationRecipient` table for MVP — every notification currently has exactly one farmer recipient. If officer-facing copies of the same event are needed (§19, §25), those are **separate rows** with `farmerId` set to null and a parallel `officerId` field (see §5.3), not a shared recipient list — this keeps ownership/authorization trivial (§31) instead of building a many-to-many recipient model the current frontend doesn't need.

### 5.2 Enums

```prisma
enum NotificationCategory {
  RISK
  WEATHER
  CROP_ACTIVITY
  MARKET
  GOVERNMENT
  INSURANCE
  OFFICER_UPDATE
}

enum NotificationPriority {
  CRITICAL
  WARNING
  INFO
}

enum NotificationActionStatus {
  NOT_REQUIRED
  REQUIRED
  IN_PROGRESS
  COMPLETED
  EXPIRED
}

enum NotificationSourceFeature {
  RISK_ENGINE
  WEATHER
  MANDI
  CROP_CALENDAR
  INSURANCE
  SCHEMES
  OFFICER
}

enum DeliveryChannel {
  IN_APP
  PUSH
  SMS
  VOICE
}

enum DeliveryStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
  RETRYING
}
```

### 5.3 `NotificationOfficerCopy` (new, minimal — supports §19/§25 officer-facing alerts)

| Field | Type | Explanation |
|---|---|---|
| `id` | `String @id @default(cuid())` | |
| `officerId` | `String` (FK → officer/user table) | Owning officer — same ownership model as farmer notifications. |
| `farmerId` | `String` (FK → `Farmer.id`) | Which farmer this officer alert concerns — used to render "Ramesh — risk 81/100" and to authorize officer access to farmer risk detail. |
| `sourceEntityId` | `String` | Same pattern as farmer-side row. |
| `title`, `description`, `priority`, `createdAt`, `isRead` | (as above) | Mirrors the farmer-facing fields; kept as a separate model rather than a shared table so farmer and officer authorization rules never have to be branched inside one query. |

### 5.4 `NotificationDelivery` (new — §28)

| Field | Type | Explanation |
|---|---|---|
| `id` | `String @id @default(cuid())` | |
| `notificationId` | `String` (FK → `Notification.id`) | |
| `channel` | `DeliveryChannel` | `IN_APP` \| `PUSH` \| `SMS` \| `VOICE` |
| `status` | `DeliveryStatus` | `PENDING` \| `SENT` \| `DELIVERED` \| `FAILED` \| `RETRYING` |
| `attempts` | `Int @default(0)` | |
| `lastAttemptAt` | `DateTime?` | |
| `providerRef` | `String?` | Twilio/MSG91/Bhashini message ID, for support debugging. |
| `errorMessage` | `String?` | Last failure reason, never logged with farmer PII beyond what's already in `Notification`. |
| `createdAt`, `updatedAt` | `DateTime` | |

`IN_APP` delivery is implicit (the `Notification` row existing **is** in-app delivery) and does not strictly need a `NotificationDelivery` row, but creating one uniformly simplifies the delivery-status query surface and testing (§40). For MVP, only `IN_APP` and `SMS` rows are actually written; `PUSH` and `VOICE` rows are modeled now so the schema doesn't change when those channels ship.

### 5.5 Existing models referenced (not redefined here)

`Farmer`, `RiskScore`, `Crop`, `MandiPrice`, `Insurance`, `Scheme`, `Booking` — as defined in the main Smart Crop PRD. The Notification backend reads from these to validate `sourceEntityId` ownership (§8, §31) but does not own or migrate them.

---

## 6. Read / Unread Design

**Decision: Option A — `isRead` + `readAt` stored directly on `Notification`.**

Rationale:
- Every notification in this system has exactly one recipient (§5.1 design note). A separate `NotificationReadState` table is the correct pattern when one notification fans out to *many* recipients who each need independent read state (e.g. a broadcast to all officers in a district) — that is not this frontend's model. Introducing the join table now adds a write and a join to every list/detail query for a case that doesn't exist yet.
- Auditability is preserved via `readAt` (when) — a full audit table isn't warranted for a boolean toggle at this scale, and general API access is already audit-logged (§31).
- If broadcast-style notifications are introduced later (e.g. "all farmers in Mayurbhanj" disaster alert), that specific case gets `NotificationReadState`, not a retrofit of this whole model — see §41 Future.

Behavior:
- `unreadCount` = `COUNT(*) WHERE farmerId = :id AND isRead = false` (indexed, §35).
- Opening `GET /api/notifications/:id` sets `isRead = true, readAt = now()` server-side (see §13 for whether this belongs in GET vs a separate call).
- `PATCH /api/notifications/read-all` bulk-updates all of one farmer's unread rows in a single statement (§14).

---

## 7. Action-Needed State Machine

```
NOT_REQUIRED   — informational notification, no CTA implies an obligation
REQUIRED       — created with an outstanding action (e.g. "check drainage today")
IN_PROGRESS    — farmer has navigated into the owning feature via the CTA
COMPLETED      — the owning feature confirms the underlying action was actually done
EXPIRED        — the action window passed (expiresAt reached) without completion
```

Transitions:

```
[create] → REQUIRED  (or NOT_REQUIRED, decided by NotificationRuleEngine per category, §19–§25)
REQUIRED → IN_PROGRESS      when POST /api/notifications/:id/action fires with intent=START
IN_PROGRESS → COMPLETED     when the owning feature reports completion (see below)
REQUIRED|IN_PROGRESS → EXPIRED   when expiresAt passes and no COMPLETED event arrived (cron sweep, §27)
```

**Critical rule: opening the notification (marking it read) never sets `COMPLETED`.** Reading ≠ acting. `COMPLETED` is only ever set by:
1. An explicit `POST /api/notifications/:id/action` call with `intent: "COMPLETE"`, sent by the frontend after the owning feature confirms the action finished (e.g. Insurance registration submitted, drainage checklist ticked), **or**
2. A webhook/internal event from the owning feature service (e.g. `InsuranceService` emits `RegistrationSubmitted` → Notification Service marks the linked notification `COMPLETED` even if the farmer never revisited Notifications).

`actionNeededCount` in the summary API = `COUNT(*) WHERE farmerId = :id AND actionStatus = 'REQUIRED'` (i.e. explicitly excludes `IN_PROGRESS` — once a farmer has started, it's no longer nagging them in the "needs action" count, but it also isn't falsely marked done).

---

## 8. Notification CTA / Action System

**Decision: `destination` is a backend-defined structured action object, never a raw frontend URL.**

```ts
type NotificationAction = {
  actionType: string;        // e.g. "VIEW_RISK_DETAILS" — a fixed, versioned key
  label: string;             // localized CTA text
  routeKey: string;          // symbolic route identifier, e.g. "risk-details"
  params: Record<string, string>; // e.g. { riskScoreId: "..." }
};
```

Why not a raw route/URL from the backend: if the API returned `"/farmer/risk/xyz123"`, nothing stops a compromised or buggy client from swapping in a different ID and hitting a route the frontend resolves without re-checking ownership — the security burden shifts onto every frontend page individually. Instead:

1. Backend stores `actionType` + `sourceFeature` + `sourceEntityId` on the `Notification` row.
2. `NotificationAuthorizationService` re-verifies, at request time, that `sourceEntityId` actually belongs to `farmerId` (e.g. `RiskScore.farmerId === notification.farmerId`) before including it in a response.
3. The API returns a `routeKey` (a small fixed enum the frontend maps to its own route table — e.g. `"risk-details" → /dashboard/risk/[id]`) plus `params`, **not** a URL string. The frontend owns URL construction; the backend owns "is this actor allowed to see this entity."
4. If the ownership check fails (e.g. the underlying `RiskScore` was deleted, or — should never happen, but defensively — belongs to a different farmer), the API returns the notification with `action: null` and `actionStatus: "EXPIRED"` rather than a broken/unauthorized link.

`routeKey` registry (fixed, versioned in `notification.rules.ts`):

| Category | `actionType` | `routeKey` | `params` |
|---|---|---|---|
| Risk | `VIEW_RISK_DETAILS` | `risk-details` | `{ riskScoreId }` |
| Weather | `OPEN_ADVISORY` | `weather-advisory` | `{ alertId }` |
| Crop Activity | `OPEN_CROP_PLAN` | `crop-calendar` | `{ cropId, stage }` |
| Market | `COMPARE_MANDIS` | `mandi-comparison` | `{ crop, district }` |
| Insurance | `VIEW_INSURANCE_ELIGIBILITY` | `insurance-eligibility` | `{ insuranceId? }` |
| Government | `VIEW_SCHEME_DETAILS` | `scheme-details` | `{ schemeId }` |
| Officer Update | `VIEW_OFFICER_UPDATE` | `officer-update` | `{ interventionId }` |

This is exactly the "generic action model" §8 of the prompt asks for: one shape, category-specific values, one authorization check function reused across all seven.

---

## 9. Notification Detail API — Response Shape

```json
{
  "success": true,
  "data": {
    "id": "ntf_abc123",
    "category": "WEATHER",
    "priority": "WARNING",
    "title": "Heavy rainfall expected tomorrow",
    "description": "65mm forecast for Mayurbhanj tomorrow",
    "timestamp": "2026-08-28T10:00:00Z",
    "isRead": true,
    "actionStatus": "REQUIRED",
    "body": {
      "whatHappened": "65mm of rain is forecast for Mayurbhanj tomorrow. Your paddy is in vegetative stage — this raises waterlogging risk given already-low soil drainage this week.",
      "whyReasons": [
        "Your district — Mayurbhanj forecast",
        "Your crop stage — vegetative",
        "Current soil moisture — already low"
      ],
      "recommendedAction": "Check field drainage today before rainfall arrives."
    },
    "voiceText": "...",
    "language": "or",
    "action": {
      "actionType": "OPEN_ADVISORY",
      "label": "Open Weather Advisory",
      "routeKey": "weather-advisory",
      "params": { "alertId": "wx_998" }
    },
    "relatedNotificationIds": ["ntf_prev1", "ntf_prev2"]
  }
}
```

`relatedNotificationIds` is resolved via `correlationId` (§17), capped at the 5 most recent, newest first, excluding the current notification.

---

## 10. Priority Summary API — Design

`GET /api/notifications/summary`

Must answer three numbers/objects **without** downloading the full feed:

```sql
-- unreadCount
SELECT COUNT(*) FROM "Notification"
WHERE "farmerId" = $1 AND "isRead" = false;

-- actionNeededCount
SELECT COUNT(*) FROM "Notification"
WHERE "farmerId" = $1 AND "actionStatus" = 'REQUIRED';

-- topCriticalAlert
SELECT * FROM "Notification"
WHERE "farmerId" = $1 AND "priority" = 'CRITICAL' AND "isRead" = false
ORDER BY "createdAt" DESC
LIMIT 1;
```

All three run against the composite index `(farmerId, isRead)`, `(farmerId, actionStatus)`, and `(farmerId, priority, isRead, createdAt)` respectively (§35) — each is a single index-only scan against a per-farmer notification volume that stays in the hundreds even over a full season, so no materialized/cached counter table is needed for MVP. If notification volume grows (e.g. broadcast weather alerts to whole districts), promote `unreadCount`/`actionNeededCount` to a Redis counter incremented on write and decremented on read — noted in §41 Future, not built now (avoids a cache-invalidation bug class for a problem the MVP doesn't have).

Response:

```json
{
  "success": true,
  "data": {
    "unreadCount": 8,
    "actionNeededCount": 3,
    "topCriticalAlert": { "...same shape as a NotificationCard item..." }
  }
}
```

---

## 11. `GET /api/notifications` — List API

**Request**

```
GET /api/notifications?category=WEATHER&priority=CRITICAL&status=unread&page=1&limit=20
```

| Param | Values | Default |
|---|---|---|
| `category` | one of the 7 enum values | none (all) |
| `priority` | `CRITICAL`\|`WARNING`\|`INFO` | none (all) |
| `status` | `unread`\|`read`\|`action_required` | none (all) |
| `page` | integer ≥1 | 1 |
| `limit` | integer, 1–50 | 20 |

**Authentication:** required — Supabase session/JWT, farmer role.
**Authorization:** `farmerId` is taken from the authenticated session, **never** from a query param or body — this is the single most important IDOR guard in this API (§31).

**Response**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "ntf_abc123",
        "category": "WEATHER",
        "priority": "WARNING",
        "title": "Heavy rainfall expected tomorrow",
        "description": "65mm forecast for Mayurbhanj tomorrow",
        "timestamp": "2026-08-28T10:00:00Z",
        "isRead": false,
        "actionStatus": "REQUIRED",
        "ctaLabel": "View Advisory",
        "action": { "actionType": "OPEN_ADVISORY", "routeKey": "weather-advisory", "params": { "alertId": "wx_998" } }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "totalCount": 47, "totalPages": 3 }
  }
}
```

**Validation:** `category`/`priority`/`status` validated against the enum at the route boundary (Zod) — invalid value → `400`.

**Status codes:** `200` success · `400` invalid query param · `401` missing/invalid auth · `500` unexpected.

**Note:** the frontend's own filter chips do client-side filtering over an already-fetched page (per the frontend PRD §8), so this endpoint's filters exist for (a) future server-side pagination once history grows and (b) any other client (officer dashboard, admin tools) that doesn't want to fetch everything.

---

## 12. `GET /api/notifications/:id` — Detail API

**Authentication:** required.
**Authorization:** load the notification, then assert `notification.farmerId === session.farmerId`. If not equal → `404` (not `403` — see §31 rationale: don't confirm the ID exists to someone who doesn't own it).

**Behavior:**
1. Fetch notification by `id`.
2. If not found or not owned → `404 NOTIFICATION_NOT_FOUND`.
3. Re-validate `sourceEntityId` ownership before building the `action` object (§8).
4. Resolve `relatedNotificationIds` via `correlationId` (§17).
5. Mark as read (see §13 for placement decision).
6. Return full detail shape (§9).

**Status codes:** `200` · `401` · `404` · `500`.

---

## 13. Mark As Read

**Decision: marking read happens as a side effect inside `GET /api/notifications/:id`, not a separate frontend call.**

Rationale: the frontend PRD is explicit that "opening a card's detail view marks it read automatically; no separate mark-as-read tap required for the primary flow." Requiring two round-trips (GET detail, then PATCH read) for the default path adds latency and a race window (farmer navigates away before the PATCH fires) for no benefit — the GET already proves the farmer viewed the content. A dedicated endpoint is still provided for cases the automatic path doesn't cover:

`PATCH /api/notifications/:id/read` — used by:
- Any future surface that shows a preview without a full detail navigation (e.g. a rich push notification "mark read" action).
- Idempotent by design: repeated calls are a no-op once `isRead = true`.

**Request:** empty body. **Response:** the updated notification (`isRead: true, readAt: "..."`).
**Status codes:** `200` · `401` · `404` (not owned) · `500`.

---

## 14. Mark All As Read

`PATCH /api/notifications/read-all`

```sql
UPDATE "Notification"
SET "isRead" = true, "readAt" = now(), "updatedAt" = now()
WHERE "farmerId" = $1 AND "isRead" = false;
```

- Single indexed bulk `UPDATE`, scoped strictly by `farmerId` from the session — structurally cannot touch another farmer's rows because `farmerId` is a `WHERE` clause built from the server-side session, never client input.
- Idempotent: a second call updates 0 rows and still returns `200`.
- Response includes the count updated: `{ "updatedCount": 8 }`.

**Status codes:** `200` · `401` · `500`.

---

## 15. Category Filter (server-side)

Implemented as a plain `WHERE category = $1` on the indexed `category` column (§11, §35). No special handling needed beyond enum validation — kept intentionally boring per the prompt's "do not overcomplicate" instruction.

---

## 16. Date Grouping

**Decision: backend returns ISO 8601 timestamps only; grouping into Today/Yesterday/Earlier stays a frontend presentation concern.**

Rationale: "Today" depends on the farmer's local timezone and device clock, not the server's. Computing groups server-side means picking a timezone (risky — India is single-timezone, but the pattern shouldn't assume that forever) and re-computing on every request as the clock ticks past midnight for that farmer. The frontend already receives `timestamp` and groups it exactly as the wireframe (§6.1 of the frontend PRD) requires, using the device's local `Date`. The backend's only obligation is that `createdAt` is stored in UTC and returned as a proper ISO string.

---

## 17. Related Alerts / Timeline

**Decision: `correlationId` on `Notification`, not a many-to-many join table.**

- When the Risk Engine creates successive notifications for the same ongoing distress episode (60→67→72→81), the notification generator reuses the **same `correlationId`** for the whole episode (started when risk first entered a "trending" state, reset when the risk score returns to a safe baseline).
- Weather: a `correlationId` per district-disaster-event (a new cyclone gets a new ID; follow-up updates to the same cyclone reuse it).
- Market: a `correlationId` per `(crop, mandi)` price-trend window.

`GET /api/notifications/:id/related` (also inlined into the detail response per §9) resolves:

```sql
SELECT * FROM "Notification"
WHERE "farmerId" = $1 AND "correlationId" = $2 AND "id" != $3
ORDER BY "createdAt" DESC
LIMIT 5;
```

This is the simplest approach that satisfies the frontend's `TimelineGroup` "related recent alerts" rail without a join table, extra write, or event-log replay.

---

## 18. Notification Generation Engine — Architecture

```
[Source feature emits event]
        │
        ▼
NotificationEventQueue (in-process function call for MVP; swap for a real
queue — e.g. a Postgres outbox table polled by a worker, or Upstash —
without changing any consumer code, if throughput requires it later)
        │
        ▼
NotificationService.handleEvent(event)
        │
        ├─ 1. Validate event payload (Zod schema per event type)
        ├─ 2. Compute dedupeKey (§26) → check unique constraint
        │      → if duplicate: no-op, return existing notification id
        ├─ 3. NotificationRuleEngine.classify(event) → priority, actionStatus
        ├─ 4. NotificationTemplateService.render(event, farmer.language) →
        │      title, description, body, voiceText, actionLabel (§29)
        ├─ 5. Persist Notification row
        ├─ 6. NotificationDeliveryService.dispatch(notification) → §28
        └─ 7. Return created notification
```

**Supported inbound events** (each with its own Zod-validated payload, handled by a dedicated function in `notification.rules.ts`):

```
RiskScoreIncreased
RiskThresholdCrossed
WeatherWarningDetected
MarketPriceDropped
CropActivityDue
InsuranceEligibilityDetected
InsuranceStatusChanged
NewSchemeMatched
OfficerInterventionCreated
```

For MVP, these events are emitted as **direct function calls** from the owning feature's server-side code (e.g. the risk-scoring cron job calls `NotificationService.handleEvent({ type: "RiskThresholdCrossed", ... })` in-process) — no message broker required. This keeps the MVP simple while the event-shaped interface means a real queue can be dropped in later (§41) without touching `NotificationRuleEngine` or `NotificationTemplateService`.

---

## 19. Risk Notification

Trigger: risk-scoring job computes a new `RiskScore` row and the score **crosses** the critical threshold (≥70) — i.e. previous score < 70 and new score ≥ 70, not merely "score is currently ≥70" (this distinction plus §26 is what prevents re-notifying every cron run while the score stays high).

On threshold crossing:
1. `dedupeKey = "RISK:{farmerId}:threshold_crossed:{scoreBand}"` where `scoreBand` buckets the score (e.g. 70–79, 80–89, 90–100) so a farmer is re-notified if risk climbs into a materially worse band, but not on every 1-point fluctuation within a band.
2. Create `CRITICAL` `Notification` with `body.whyReasons` populated from the `RiskScore.reasons` array (top 3 contributing factors, already computed by the Risk Engine — the Notification Service never recomputes or reinterprets agronomic data, per the main PRD's "LLM never invents agronomic facts" principle).
3. `actionStatus = REQUIRED`, `action = VIEW_RISK_DETAILS`.
4. Same event also creates a `NotificationOfficerCopy` for the officer assigned to that farmer's district, so the Officer Command Center's "high-risk queue" entry and the farmer's notification are two rows sharing the same `sourceEntityId` (the `RiskScore.id`) but independent read/action state.
5. Reuses the farmer's active `correlationId` for this distress episode (§17), or starts a new one if none is open.

---

## 20. Weather Notification

Trigger: scheduled weather/disaster poll detects a qualifying event (heavy rainfall, cyclone, flood, heatwave) for the farmer's district.

Fields populated: severity (drives `CRITICAL` vs `WARNING` per §4), location (farmer's district, from `Farmer.district`), expected time (from the source API), farmer relevance (cross-referenced against the farmer's current `Crop.stage` — e.g. "vegetative stage raises waterlogging risk" only appears when that's actually true for this farmer), recommended action (from a curated per-event-type action table, not LLM-generated timing, matching the main PRD's data-integrity principle), CTA → `OPEN_ADVISORY`.

Source data must come from the same verified weather/disaster feed (IMD/OpenWeatherMap) already integrated for the Advisory Engine — the Notification Service is a consumer of that data, not an independent source.

---

## 21. Market Notification

Trigger: scheduled Mandi price refresh (GitHub Actions cron, per main PRD §7) detects a price change beyond a configurable threshold (e.g. ≥8% drop) for a crop the farmer grows, or an MSP deviation.

The notification's price figures are read directly from the `MandiPrice` table populated by that same cron job — the Notification Service never fabricates or estimates a price. CTA → `COMPARE_MANDIS`.

---

## 22. Crop Activity Notification

Trigger: daily cron matches "today" against the farmer's `Crop.sowingDate` + the curated Crop Guide's stage calendar (main PRD §5.4) — same non-LLM-generated source used by the Crop Guide feature.

Every Crop Activity notification carries `sourceFeature = CROP_CALENDAR` and `sourceEntityId = Crop.id`, so the authorization check (§8) and the eventual CTA (`OPEN_CROP_PLAN`) both resolve against the farmer's own crop record. Priority defaults to `INFO` unless the activity is deadline-adjacent (e.g. "last day to apply fertilizer for this stage"), which promotes it to `WARNING`.

---

## 23. Insurance Notification

Triggers: `InsuranceEligibilityDetected` (risk score or crop/scheme match makes the farmer newly eligible), `InsuranceStatusChanged` (Not Registered → Pending → Approved/Rejected, mirroring the main PRD's `Insurance.status` field).

CTA → `VIEW_INSURANCE_ELIGIBILITY`. Because insurance data is sensitive, the detail response only exposes fields the farmer is authorized to see about their own record — no bank/insurer internal notes are ever surfaced through this API (that's a separate bank-facing surface, out of scope here). See RBAC (§32).

---

## 24. Government Scheme Notification

Triggers: `NewSchemeMatched` (auto-match against farmer profile, per main PRD §5.9), scheme deadline approaching, scheme content updated.

`sourceEntityId` must reference a real `Scheme.id` — the notification **links to a valid scheme entity**, never an arbitrary frontend-supplied URL (§8's authorization pattern applies identically here: the backend re-validates the scheme still exists and is still eligible for this farmer before returning the action).

---

## 25. Officer Update Notification

Triggers: `OfficerInterventionCreated` (officer assigns a field visit, updates an intervention, or sends a message tied to this farmer's case).

**Visible-to-farmer fields:** officer's name/role, the update text, the recommended next step, and the intervention status. **Not exposed to the farmer:** internal officer notes, other farmers' case data, or officer contact details beyond what the officer explicitly chooses to share through the update text. This boundary is enforced in `NotificationTemplateService` at render time, not filtered client-side.

---

## 26. Duplicate Notification Prevention

**Mechanism:** a `dedupeKey` column with a **unique constraint**, computed deterministically per event type before insert.

```prisma
model Notification {
  // ...
  dedupeKey String @unique
}
```

Insert is wrapped as "create, and if the unique constraint on `dedupeKey` is violated, treat as a no-op and return the existing row" (`upsert`-style `catch` on the Prisma unique-violation error, or `ON CONFLICT (dedupeKey) DO NOTHING` at the SQL level).

**Examples of `dedupeKey` composition:**

| Event | `dedupeKey` |
|---|---|
| Risk threshold crossed into 80–89 band | `RISK:{farmerId}:threshold:80_89` |
| Same risk score re-evaluated at 81 by the next cron run (no band change) | Same key as above → insert rejected, no duplicate created |
| Heavy rainfall warning for tomorrow, district X | `WEATHER:{farmerId}:{alertId}` where `alertId` is the source API's own event ID — if IMD re-issues the identical bulletin, the same `alertId` prevents a duplicate |
| Paddy price drop 8%, mandi Y, date Z | `MARKET:{farmerId}:{crop}:{mandi}:{date}` |
| Crop activity "soil inspection due today" | `CROP:{farmerId}:{cropId}:{stage}:{date}` |

This directly answers the prompt's "risk score = 81 must not generate 100 identical notifications" requirement: the scheduled risk job can run hourly forever at score 81 and only the first run's insert succeeds.

---

## 27. Notification Expiration

`expiresAt` is nullable and set per category:

| Category | Expiration behavior |
|---|---|
| Weather | `expiresAt` = forecast window end (e.g. 24–48h after the event time) — an "expected tomorrow" alert stops being actionable once tomorrow has passed. |
| Crop Activity | `expiresAt` = end of the relevant stage window — "soil inspection due today" becomes stale, not deleted, after today. |
| Market | `expiresAt` = a few days after the price snapshot — kept briefly actionable, then treated as historical. |
| Risk | `null` — risk history is never expired; it's part of the farmer's distress timeline (§17, §19) and the officer's case record. |
| Insurance | `null` — deadlines may pass, but status-change history stays permanently useful for the bank/officer trail, matching the prompt's explicit instruction not to lose this. |
| Officer Update | `null` — permanent case record. |
| Government | `expiresAt` = scheme application deadline, if the scheme has one; `null` otherwise. |

**Backend behavior on expiry:** a nightly cron flips `actionStatus` from `REQUIRED`/`IN_PROGRESS` to `EXPIRED` for rows past `expiresAt` (§7). **The row is never deleted** — expiration changes actionability, not visibility or history, matching "do not automatically delete important historical records unless justified." The frontend can still show an expired card (muted CTA, e.g. "Advisory window closed") rather than have it vanish.

---

## 28. Delivery System

`NotificationDeliveryService.dispatch(notification)` fans out to channels based on category/priority and the farmer's registered contact capability:

| Channel | When used |
|---|---|
| `IN_APP` | Always — this is the notification itself; always considered "delivered" once the row is persisted. |
| `SMS` | `CRITICAL` and `WARNING` notifications, always, for low-connectivity-first reach (per main PRD §5.10) — sent via Twilio/MSG91. |
| `VOICE` (IVR script) | `CRITICAL` only, for MVP — mocked script acceptable per main PRD §13 scope. |
| `PUSH` | Modeled in schema (§5.4) but not implemented for MVP — no push infra in this stack yet. |

Each dispatch attempt writes/updates a `NotificationDelivery` row with `status` transitioning `PENDING → SENT → DELIVERED` on success, or `PENDING → FAILED → RETRYING → FAILED` on repeated failure (max 3 attempts, exponential backoff via the same cron infrastructure used for the delivery retry sweep).

**Critical rule:** a delivery failure on any external channel never touches the `Notification` row itself — the farmer still sees it in-app. Delivery is strictly additive.

---

## 29. Multilingual Support

**Decision: Option A — store one fully-rendered notification per language, not structured multi-language JSON on a single row.**

Rationale: unlike static UI copy (button labels, page titles), notification content is **personalized** — it embeds the farmer's district, crop stage, specific numbers (rainfall mm, risk score, price %). This can't be looked up from a generic translation catalog at render time; it has to be generated once, in the farmer's language, from a template + variables, at creation time. So:

- `NotificationTemplateService` holds **template strings per language** (e.g. `weather.heavy_rainfall.title.or`, `.hi`, `.en`) with placeholders (`{district}`, `{mm}`, `{stage}`).
- At event-handling time (§18 step 4), the service looks up the farmer's `language` field on `Farmer`, selects the matching template set, interpolates the event's variables, and writes the **final rendered strings** into the `Notification` row's `title`/`description`/`body`/`voiceText`/`actionLabel`.
- If the farmer changes their language preference later, **already-created notifications stay in their original language** (historical record); only new notifications use the new preference. This avoids a re-translation job and matches how the rest of the product (SMS already sent, voice already played) behaves.

This is simpler to serve (no runtime translation lookup on every GET) and matches the "farmer's preferred language determines delivered content" requirement directly, at the cost of storing N language-specific copies only for the one row that farmer actually receives — never all three.

---

## 30. Voice / TTS Support

**Decision: backend stores `voiceText`; does not generate or cache audio for MVP.**

- `Notification.voiceText` (§5.1) is the exact string the existing `VoiceButton` component passes to Bhashini's TTS call, alongside `language`.
- The backend does **not** pre-generate or cache audio files — Bhashini TTS is called client-side (or via a thin passthrough proxy if CORS/key requirements demand it) each time the farmer taps play, exactly as the frontend PRD specifies (`VoiceButton` is reused unmodified, §11 of the frontend PRD).
- Rationale for not caching audio now: caching adds storage (Supabase Storage) and cache-invalidation complexity (a notification's voice text never changes after creation, so caching is *safe*, but it's pure optimization with no MVP-stage payoff — every notification is heard at most a handful of times by one farmer). Noted as a Future item (§41) if TTS API costs or latency become a problem at scale.

---

## 31. Security

**Authentication:** every endpoint requires a valid Supabase Auth session (phone/OTP, per main PRD §7). No unauthenticated route exists in this feature.

**Authorization / farmer ownership:** the single rule that makes this feature IDOR-safe:

> `farmerId` is **always** derived from the authenticated session server-side. It is never accepted from a URL param, query string, or request body. Every query (`list`, `summary`, `detail`, `read`, `read-all`, `action`, `related`) includes `WHERE farmerId = session.farmerId` as a non-optional clause built in `NotificationRepository`, not left to each route handler to remember.

- `GET /api/notifications/:id` for a notification belonging to a different farmer returns **`404`, not `403`** — a `403` confirms the ID exists and belongs to someone; `404` gives an attacker no signal. This applies to all by-ID routes.
- Officer/bank/government roles never query the farmer's `Notification` table directly — they query `NotificationOfficerCopy` (§5.3) or their own equivalent, scoped by their own ID, with a separate `NotificationAuthorizationService.assertOfficerCanViewFarmer(officerId, farmerId)` check (backed by the officer's assigned-district relationship in the main schema) before any farmer-linked risk detail is exposed.
- **Input validation:** every route validates query/body params with Zod at the boundary before touching Prisma — rejects unknown enum values, malformed IDs, out-of-range pagination.
- **Rate limiting:** per-farmer token bucket on write endpoints (`read`, `read-all`, `action`) via Upstash Redis — e.g. 60 requests/minute — to blunt abuse/scripted polling; read endpoints get a looser limit (e.g. 120/minute).
- **Secure IDs:** `cuid()` for all notification IDs — non-sequential, non-guessable, unlike an auto-increment integer.
- **Sensitive information:** insurance/loan figures only ever appear in a notification belonging to that farmer, resolved through the same ownership check as everything else — no separate carve-out.
- **Audit logging:** every mutating action (`read`, `read-all`, `action` state changes, notification creation from events) is logged with `notificationId`, `actorId`, `action`, `timestamp` — logs never include the farmer's raw loan amount, phone number, or other PII beyond IDs (§ Final Checklist).

---

## 32. RBAC Matrix

| Action | Farmer | Officer | Bank | Government | Admin |
|---|---|---|---|---|---|
| Read own notifications | ✅ | ✅ (own `NotificationOfficerCopy` only) | ❌ | ❌ | ✅ (support/debug only, logged) |
| Mark own notification read | ✅ | ✅ (own copy) | ❌ | ❌ | ❌ |
| Read related risk notification (own) | ✅ | ✅ (for assigned farmers only) | ❌ | ❌ | ✅ |
| Create notification | ❌ (system only) | ❌ (system only, triggered by officer *actions* like `OfficerInterventionCreated`, not direct writes) | ❌ | ❌ | ❌ |
| Send notification (trigger delivery) | ❌ | ❌ | ❌ | ❌ | ❌ (delivery is automatic on creation, no manual "send" action for MVP) |
| View officer notification | ❌ | ✅ (own) | ❌ | ❌ | ✅ |
| View insurance notification | ✅ (own) | ✅ (assigned farmers, read-only) | ❌ (banks use their own approval-queue surface, out of scope) | ❌ | ✅ |
| Manage notification templates | ❌ | ❌ | ❌ | ❌ | ✅ (content team via admin tooling, out of scope for this PRD) |
| View notification delivery logs | ❌ | ❌ | ❌ | ❌ | ✅ |

All "❌ system only" rows mean: no HTTP endpoint exists for a human actor to directly create a notification. Creation only happens through `NotificationService.handleEvent()`, called from trusted server-side code in the owning feature — never from a client-facing route.

---

## 33. API Specification

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| `GET` | `/api/notifications` | Required | Farmer |
| `GET` | `/api/notifications/:id` | Required | Farmer (owner) |
| `PATCH` | `/api/notifications/:id/read` | Required | Farmer (owner) |
| `PATCH` | `/api/notifications/read-all` | Required | Farmer |
| `GET` | `/api/notifications/summary` | Required | Farmer |
| `GET` | `/api/notifications/:id/related` | Required | Farmer (owner) |
| `POST` | `/api/notifications/:id/action` | Required | Farmer (owner) |

`GET /api/notifications/:id/related` is kept as its own endpoint even though the detail response inlines `relatedNotificationIds` (§9), because the desktop detail view's `TimelineGroup` rail can lazy-load it independently without re-fetching the full detail payload — a small, genuinely separable concern, not redundant.

No `POST /api/notifications` (create) or `POST /api/notifications/:id/send` (manual delivery trigger) endpoints exist — per §32, creation and delivery are system-internal, not client-callable, so exposing them as HTTP routes would only add attack surface for no frontend need.

### 33.1 `POST /api/notifications/:id/action`

**Request:**
```json
{ "intent": "START" }
```
or
```json
{ "intent": "COMPLETE" }
```

**Behavior:** validates `intent` ∈ `{START, COMPLETE}`, asserts ownership, applies the state machine transition (§7), rejects invalid transitions (e.g. `COMPLETE` on a notification still `NOT_REQUIRED`) with `409 INVALID_ACTION_STATE`.

**Response:** updated notification `actionStatus`.

**Status codes:** `200` · `400` invalid intent · `401` · `404` (not owned) · `409` invalid transition · `500`.

### 33.2 Full per-endpoint detail

| Endpoint | Request | Response | Validation | Status codes | Error cases |
|---|---|---|---|---|---|
| `GET /api/notifications` | Query: `category?, priority?, status?, page?, limit?` | `{ notifications[], pagination }` | Enum + int range checks | 200/400/401/500 | invalid enum → `400 INVALID_FILTER` |
| `GET /api/notifications/:id` | Path `id` | Full detail (§9) | `id` format | 200/401/404/500 | not found/not owned → `404 NOTIFICATION_NOT_FOUND` |
| `PATCH /api/notifications/:id/read` | none | Updated notification | `id` format | 200/401/404/500 | same as above |
| `PATCH /api/notifications/read-all` | none | `{ updatedCount }` | none | 200/401/500 | — |
| `GET /api/notifications/summary` | none | `{ unreadCount, actionNeededCount, topCriticalAlert }` | none | 200/401/500 | — |
| `GET /api/notifications/:id/related` | Path `id` | `{ related: NotificationCard[] }` | `id` format | 200/401/404/500 | not found/not owned → `404` |
| `POST /api/notifications/:id/action` | `{ intent }` | Updated `actionStatus` | `intent` enum | 200/400/401/404/409/500 | invalid transition → `409 INVALID_ACTION_STATE` |

---

## 34. API Response Format

**Success:**
```json
{ "success": true, "data": { } }
```

**Error:**
```json
{ "success": false, "error": { "code": "NOTIFICATION_NOT_FOUND", "message": "Notification not found." } }
```

**Notification-specific error codes:**

| Code | Meaning | HTTP status |
|---|---|---|
| `NOTIFICATION_NOT_FOUND` | ID doesn't exist or isn't owned by the caller | 404 |
| `INVALID_FILTER` | Bad `category`/`priority`/`status` query value | 400 |
| `INVALID_ACTION_INTENT` | `intent` not in `{START, COMPLETE}` | 400 |
| `INVALID_ACTION_STATE` | Requested transition not allowed from current `actionStatus` | 409 |
| `UNAUTHENTICATED` | No/invalid session | 401 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Unexpected failure | 500 |

---

## 35. Database Indexing

| Index | Why |
|---|---|
| `(farmerId, isRead)` | Powers `unreadCount` and the "unread" list filter — the two hottest per-farmer queries. |
| `(farmerId, actionStatus)` | Powers `actionNeededCount` and the "action required" filter. |
| `(farmerId, category)` | Powers category-filtered list queries. |
| `(farmerId, priority, isRead, createdAt DESC)` | Powers `topCriticalAlert` (unread + critical, most recent) in a single index-only scan. |
| `(farmerId, createdAt DESC)` | Powers the default (unfiltered) feed ordering and pagination. |
| `(correlationId, farmerId, createdAt DESC)` | Powers `related` alerts lookup. |
| `dedupeKey` (unique) | Enforces duplicate prevention (§26) at the database level, not just in application code. |
| `(expiresAt)` where not null | Powers the nightly expiration sweep (§27) without a full table scan. |
| `(sourceFeature, sourceEntityId)` | Powers ownership re-validation lookups (§8) and any "did we already notify about this specific source event" checks beyond `dedupeKey`. |

---

## 36. Backend Folder Structure

```
app/
└── api/
    └── notifications/
        ├── route.ts                    # GET (list)
        ├── summary/
        │   └── route.ts                # GET
        ├── read-all/
        │   └── route.ts                # PATCH
        └── [id]/
            ├── route.ts                # GET (detail, marks read)
            ├── read/
            │   └── route.ts            # PATCH
            ├── action/
            │   └── route.ts            # POST
            └── related/
                └── route.ts            # GET

lib/
└── notifications/
    ├── notification.service.ts         # orchestrates create/read/action flows
    ├── notification.repository.ts      # all Prisma queries, always farmer-scoped
    ├── notification.types.ts           # NotificationBody, NotificationAction, etc.
    ├── notification.validator.ts       # Zod schemas for query/body params + inbound events
    ├── notification.rules.ts           # NotificationRuleEngine — priority + actionStatus per category
    ├── notification.delivery.ts        # NotificationDeliveryService — SMS/voice dispatch
    ├── notification.templates.ts       # NotificationTemplateService — per-language rendering
    └── notification.authorization.ts   # ownership + sourceEntity re-validation checks

jobs/
└── notifications/
    ├── expire-notifications.cron.ts    # nightly actionStatus → EXPIRED sweep (§27)
    └── retry-deliveries.cron.ts        # NotificationDelivery retry sweep (§28)
```

---

## 37. Service Responsibilities

| Service | Responsibility |
|---|---|
| `NotificationService` | Single entry point for both directions: `handleEvent()` (create from an inbound event) and the read-side orchestration used by route handlers (fetch + mark-read + related, in one place so route handlers stay thin). |
| `NotificationRepository` | Every Prisma query. The **only** place `farmerId` scoping is written — route handlers and the service never build raw `WHERE` clauses themselves, so ownership enforcement can't be forgotten in a new endpoint. |
| `NotificationRuleEngine` | Pure functions: `classifyPriority(event)`, `determineActionStatus(event)`, `computeDedupeKey(event)`. No I/O — fully unit-testable (§40). |
| `NotificationDeliveryService` | Fans out to SMS/voice/push per §28, writes `NotificationDelivery` rows, handles retry logic. Never touches the `Notification` row's core fields. |
| `NotificationTemplateService` | Language-aware rendering (§29): template lookup + variable interpolation → final `title`/`description`/`body`/`voiceText`/`actionLabel`. |
| `NotificationAuthorizationService` | `assertFarmerOwnsNotification()`, `assertSourceEntityBelongsToFarmer()`, `assertOfficerCanViewFarmer()` — every authorization check in the feature funnels through here, so it's the one place to audit for security review. |

Route handlers (`app/api/notifications/**/route.ts`) do only: parse/validate request → call one `NotificationService` method → shape the `{ success, data }` / `{ success, error }` envelope. No business logic lives in a route file.

---

## 38. Prisma Schema (Notifications-only)

```prisma
// ── Existing models referenced, NOT redefined here ──
// model Farmer { id String @id ... }
// model RiskScore { id String @id ... farmerId String ... }
// model Crop { id String @id ... }
// model MandiPrice { id String @id ... }
// model Insurance { id String @id ... }
// model Scheme { id String @id ... }

// ── NEW models for this feature ──

enum NotificationCategory {
  RISK
  WEATHER
  CROP_ACTIVITY
  MARKET
  GOVERNMENT
  INSURANCE
  OFFICER_UPDATE
}

enum NotificationPriority {
  CRITICAL
  WARNING
  INFO
}

enum NotificationActionStatus {
  NOT_REQUIRED
  REQUIRED
  IN_PROGRESS
  COMPLETED
  EXPIRED
}

enum NotificationSourceFeature {
  RISK_ENGINE
  WEATHER
  MANDI
  CROP_CALENDAR
  INSURANCE
  SCHEMES
  OFFICER
}

enum DeliveryChannel {
  IN_APP
  PUSH
  SMS
  VOICE
}

enum DeliveryStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
  RETRYING
}

model Notification {
  id             String                    @id @default(cuid())
  farmerId       String
  farmer         Farmer                    @relation(fields: [farmerId], references: [id])
  category       NotificationCategory
  priority       NotificationPriority
  title          String
  description    String
  body           Json
  voiceText      String
  language       String
  isRead         Boolean                   @default(false)
  readAt         DateTime?
  actionStatus   NotificationActionStatus  @default(NOT_REQUIRED)
  actionType     String
  actionLabel    String
  sourceFeature  NotificationSourceFeature
  sourceEntityId String
  correlationId  String
  dedupeKey      String                    @unique
  expiresAt      DateTime?
  createdAt      DateTime                  @default(now())
  updatedAt      DateTime                  @updatedAt

  deliveries     NotificationDelivery[]

  @@index([farmerId, isRead])
  @@index([farmerId, actionStatus])
  @@index([farmerId, category])
  @@index([farmerId, priority, isRead, createdAt])
  @@index([farmerId, createdAt])
  @@index([correlationId, farmerId, createdAt])
  @@index([sourceFeature, sourceEntityId])
  @@index([expiresAt])
}

model NotificationOfficerCopy {
  id             String               @id @default(cuid())
  officerId      String
  farmerId       String
  farmer         Farmer               @relation(fields: [farmerId], references: [id])
  category       NotificationCategory
  priority       NotificationPriority
  title          String
  description    String
  sourceEntityId String
  isRead         Boolean              @default(false)
  createdAt      DateTime             @default(now())

  @@index([officerId, isRead])
  @@index([farmerId])
}

model NotificationDelivery {
  id              String          @id @default(cuid())
  notificationId  String
  notification    Notification    @relation(fields: [notificationId], references: [id])
  channel         DeliveryChannel
  status          DeliveryStatus  @default(PENDING)
  attempts        Int             @default(0)
  lastAttemptAt   DateTime?
  providerRef     String?
  errorMessage    String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([notificationId])
  @@index([status])
}
```

**Farmer model addition required** (one line in the existing model, not a redesign):
```prisma
model Farmer {
  // ...existing fields...
  notifications       Notification[]
  officerNotifications NotificationOfficerCopy[]
}
```

---

## 39. Seed Data

```ts
// lib/notifications/seed.ts
const seedNotifications = [
  {
    category: "RISK",
    priority: "CRITICAL",
    title: "Your crop distress risk increased to 81/100",
    description: "Risk crossed critical threshold — 3 factors contributing",
    body: {
      whatHappened: "Your distress risk score rose to 81/100, driven by low rainfall, a paddy price drop, and your loan due date approaching.",
      whyReasons: ["Rainfall down 35% this week", "Paddy price down 22%", "Loan due in 8 days"],
      recommendedAction: "Review your risk breakdown and consider the suggested alternative crop."
    },
    actionStatus: "REQUIRED",
    actionType: "VIEW_RISK_DETAILS",
    actionLabel: "View Risk Details",
    sourceFeature: "RISK_ENGINE"
  },
  {
    category: "WEATHER",
    priority: "WARNING",
    title: "Heavy rainfall expected tomorrow",
    description: "65mm forecast for Mayurbhanj tomorrow",
    body: {
      whatHappened: "65mm of rain is forecast for Mayurbhanj tomorrow. Your paddy is in vegetative stage — this raises waterlogging risk given already-low soil drainage this week.",
      whyReasons: ["Your district — Mayurbhanj forecast", "Your crop stage — vegetative", "Current soil moisture — already low"],
      recommendedAction: "Check field drainage today before rainfall arrives."
    },
    actionStatus: "REQUIRED",
    actionType: "OPEN_ADVISORY",
    actionLabel: "Open Weather Advisory",
    sourceFeature: "WEATHER"
  },
  {
    category: "CROP_ACTIVITY",
    priority: "INFO",
    title: "Soil inspection due today",
    description: "Vegetative-stage checklist item for your paddy",
    body: {
      whatHappened: "Today's farming calendar entry for your paddy is a soil inspection.",
      whyReasons: ["Your crop stage — vegetative", "Scheduled per your sowing date"],
      recommendedAction: "Open your crop plan to see today's full checklist."
    },
    actionStatus: "REQUIRED",
    actionType: "OPEN_CROP_PLAN",
    actionLabel: "Open Crop Plan",
    sourceFeature: "CROP_CALENDAR"
  },
  {
    category: "MARKET",
    priority: "WARNING",
    title: "Paddy price decreased 8%",
    description: "Nearby mandi prices have dropped this week",
    body: {
      whatHappened: "Paddy's modal price at your nearest mandis dropped 8% over the past week.",
      whyReasons: ["Your crop — Paddy", "Your district's tracked mandis"],
      recommendedAction: "Compare mandis before selling to find the best net realization."
    },
    actionStatus: "REQUIRED",
    actionType: "COMPARE_MANDIS",
    actionLabel: "Compare Mandis",
    sourceFeature: "MANDI"
  },
  {
    category: "GOVERNMENT",
    priority: "INFO",
    title: "New scheme matched: PM-KISAN top-up",
    description: "You may be eligible based on your land size and crop",
    body: {
      whatHappened: "A new scheme matching your profile (land size, crop, district) was found.",
      whyReasons: ["Your land size", "Your crop — Paddy", "Your district"],
      recommendedAction: "Review eligibility and required documents."
    },
    actionStatus: "REQUIRED",
    actionType: "VIEW_SCHEME_DETAILS",
    actionLabel: "View Scheme Details",
    sourceFeature: "SCHEMES"
  },
  {
    category: "INSURANCE",
    priority: "WARNING",
    title: "You're now eligible for crop insurance",
    description: "Your high risk score qualifies you for PMFBY-style coverage",
    body: {
      whatHappened: "Based on your current risk score and crop, you're eligible to register for crop insurance.",
      whyReasons: ["Risk score above eligibility threshold", "Your crop — Paddy"],
      recommendedAction: "Start your insurance registration today."
    },
    actionStatus: "REQUIRED",
    actionType: "VIEW_INSURANCE_ELIGIBILITY",
    actionLabel: "View Insurance Eligibility",
    sourceFeature: "INSURANCE"
  },
  {
    category: "OFFICER_UPDATE",
    priority: "INFO",
    title: "Field visit scheduled",
    description: "Your assigned officer scheduled a visit for this week",
    body: {
      whatHappened: "Your assigned agriculture officer scheduled a field visit to follow up on your risk alert.",
      whyReasons: ["Your risk score triggered officer follow-up"],
      recommendedAction: "Be available at your field on the scheduled date."
    },
    actionStatus: "NOT_REQUIRED",
    actionType: "VIEW_OFFICER_UPDATE",
    actionLabel: "View Update",
    sourceFeature: "OFFICER"
  }
];
```

(Each entry above is expanded at insert time with `farmerId`, `language`, `voiceText`, `dedupeKey`, `correlationId`, and `sourceEntityId` bound to the demo farmer "Ramesh" from the main PRD's demo narrative.)

---

## 40. Testing

**Unit**
- `NotificationRuleEngine.classifyPriority()` — every category/threshold boundary (e.g. risk score exactly 69 vs 70).
- `computeDedupeKey()` — identical events produce identical keys; different score bands produce different keys.
- Action state machine transitions — every legal transition succeeds, every illegal one (e.g. `COMPLETE` from `NOT_REQUIRED`) throws.
- Category/priority enum validation — rejects out-of-enum strings.
- Expiration logic — a notification past `expiresAt` with `REQUIRED` status flips to `EXPIRED`; one with `COMPLETED` status does not.

**Integration**
- Create notification via `handleEvent()` → row persisted with correct fields.
- `GET /api/notifications` → correct filtering/pagination.
- `PATCH .../read` → idempotent, `readAt` set once.
- `PATCH .../read-all` → only affects the calling farmer's rows (seed two farmers, assert farmer B's rows untouched).
- `GET /api/notifications/summary` → counts match a seeded fixture exactly.
- `GET /api/notifications/:id` → full detail shape, `relatedNotificationIds` correctly resolved via `correlationId`.
- Authorization — farmer A requesting farmer B's notification ID → `404`.

**Security**
- IDOR: authenticated farmer A, notification ID belonging to farmer B → `404`, and response contains zero fields from farmer B's notification.
- Cross-user `read-all` — verify no farmer B rows change when farmer A calls it.
- Role escalation — officer session attempting `GET /api/notifications/:id` on a farmer notification ID → `404` (officers use `NotificationOfficerCopy` routes only).
- Invalid notification ID (malformed `cuid`) → `400`, not a raw DB error.
- Unauthorized creation — confirm no public route exists to call `NotificationService.handleEvent()` directly (route enumeration test).
- Rate limiting — burst of requests past the configured limit → `429`.

**End-to-end**
```
Risk cron detects threshold crossing
  → Notification created (CRITICAL) + NotificationOfficerCopy created
  → Farmer calls GET /api/notifications → sees it, unread
  → Farmer calls GET /api/notifications/:id → isRead flips true
  → Frontend calls POST .../action { intent: START } → actionStatus IN_PROGRESS
  → Farmer completes the flow in Risk Details; that feature emits completion
  → actionStatus COMPLETED
  → GET /api/notifications/summary → actionNeededCount decreases by 1
```

---

## 41. MVP vs Future

**MVP**
- PostgreSQL + Prisma, models exactly as §38.
- Notification create (event-driven, in-process calls) / list / detail / read / read-all / summary / related / action.
- All 7 categories, 3 priorities, backend-owned classification.
- Dedupe via unique `dedupeKey`.
- Expiration via nightly cron flipping `actionStatus`, no deletion.
- In-app + SMS delivery; voice delivery as a mocked IVR script (matches main PRD §13 scope).
- Per-language rendered content at creation time (§29); voice text stored, TTS called client-side.
- Full RBAC + IDOR-safe ownership scoping.

**Future**
- Real event bus (Kafka/Upstash queue) replacing in-process `handleEvent()` calls, for when notification-producing services are split out.
- WebSocket/real-time push instead of poll-on-load for the unread badge.
- Redis-cached summary counters if per-farmer notification volume grows beyond what a plain indexed count comfortably serves.
- `NotificationReadState` join table if/when broadcast (many-recipient) notifications are introduced.
- Push notification channel (`DeliveryChannel.PUSH` already modeled).
- TTS audio caching in Supabase Storage if Bhashini call volume/latency becomes a cost concern.
- ML-based priority/urgency scoring beyond the current rule-based classification.
- Notification preference center (per-category mute, quiet hours) — not in the current frontend scope.
- Multi-device delivery management (dedupe across a farmer's multiple devices).
- Advanced analytics (open rates, action-completion rates per category) for product iteration.

---

## 42. Implementation Order

1. Database models (`Notification`, `NotificationOfficerCopy`, `NotificationDelivery`, enums) added to `schema.prisma`.
2. Prisma migration.
3. Notification types/enums mirrored in `notification.types.ts`.
4. Zod validation schemas (`notification.validator.ts`) — query params, body payloads, inbound event shapes.
5. Authorization service (`notification.authorization.ts`) — ownership + source-entity checks, built and unit-tested before any route touches Prisma directly.
6. `NotificationService` skeleton + `NotificationRepository` (all queries farmer-scoped from day one).
7. `NotificationRepository` full query set.
8. `GET /api/notifications` (list).
9. `GET /api/notifications/:id` (detail), including mark-read side effect.
10. `PATCH .../read` and `PATCH .../read-all`.
11. `GET /api/notifications/summary`.
12. `GET /api/notifications/:id/related`.
13. `POST /api/notifications/:id/action` + action state machine.
14. Notification generation: `handleEvent()` + `NotificationRuleEngine` for all 9 event types.
15. Duplicate prevention (`dedupeKey` unique constraint + conflict handling) — built alongside step 14, not after.
16. Delivery: `NotificationDeliveryService` (SMS via Twilio/MSG91, mocked voice script).
17. Seed data (§39).
18. Tests (§40) — unit first, then integration, then security, then the end-to-end scenario.
19. Frontend integration — wire `notification page/store.ts` to the real endpoints, replacing `notifications.mock.ts`.
20. Deployment — migration run on Supabase/Neon, cron jobs (expiration sweep, delivery retry) registered in GitHub Actions alongside the existing weather/mandi refresh jobs.

---

## 43. Frontend ↔ Backend Contract

| Frontend Requirement | Backend Support |
|---|---|
| `unreadCount` | `GET /api/notifications/summary` |
| `actionNeededCount` | `GET /api/notifications/summary` |
| `topCriticalAlert` | `GET /api/notifications/summary` |
| Category filter chips | `GET /api/notifications?category=` |
| `NotificationCard` fields | `GET /api/notifications` (list item shape, §11) |
| `NotificationDetail` (what/why/action/related) | `GET /api/notifications/:id` (§9) |
| Mark read (auto on open) | Side effect of `GET /api/notifications/:id` |
| Mark read (explicit) | `PATCH /api/notifications/:id/read` |
| Mark all read (desktop) | `PATCH /api/notifications/read-all` |
| Action taken / action started | `POST /api/notifications/:id/action` |
| Related alerts / `TimelineGroup` | `GET /api/notifications/:id/related` |
| `VoiceButton` text + language | `voiceText` + `language` fields on notification |
| CTA (`ActionButton`) | Backend-defined `action` object (`routeKey` + `params`), never a raw URL |
| Date grouping (Today/Yesterday/Earlier) | Frontend groups client-side from `timestamp` (ISO, UTC) — §16 |
| Category-agnostic `CategoryFilter`/`VoiceButton` reuse | No backend impact — purely a frontend component-sharing decision already covered by the frontend PRD |

Every requirement enumerated in the frontend PRD (§5–§12 of that document) maps to exactly one row above.

---

## 44. Final Security Checklist

- [x] Authentication required on every endpoint
- [x] Farmer ownership enforced via server-derived `farmerId`, never client-supplied
- [x] RBAC enforced (§32) — no cross-role access to farmer notification data
- [x] IDOR prevented — by-ID lookups return `404` (not `403`) on ownership mismatch
- [x] Input validation via Zod at every route boundary
- [x] Rate limiting on read and write endpoints via Upstash Redis
- [x] Duplicate prevention via unique `dedupeKey` constraint
- [x] Idempotent read operations (`read`, `read-all` are safe to retry)
- [x] Idempotent notification creation (`handleEvent()` is a no-op on `dedupeKey` conflict)
- [x] Secure CTA/action handling — structured `routeKey`+`params`, backend re-validates `sourceEntityId` ownership before returning an action
- [x] No arbitrary URLs trusted from client — action destinations are backend-resolved
- [x] Sensitive data (insurance, loan, officer notes) protected by the same ownership + RBAC checks as all other fields
- [x] Audit logging on all mutating actions
- [x] Delivery failures handled without affecting the in-app notification record
- [x] External API failures (weather/mandi/Bhashini/SMS provider) handled with retry + `FAILED`/`RETRYING` status, never crash notification creation
- [x] Secrets (Twilio/MSG91/Bhashini keys) stored in environment variables, never in code or logs
- [x] No sensitive data (phone numbers, loan amounts, raw farmer PII) written to application logs — only IDs and status codes
