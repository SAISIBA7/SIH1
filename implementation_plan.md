# Equipment Backend — Full Implementation Plan

## Goal

Build a complete backend for the Equipment page Dashboard using the **existing AWS RDS MySQL database**. This covers:

1. **Fix critical bugs** in the current codebase (broken hooks placement, merge conflicts in `lib/db.ts`)
2. **GET `/api/equipment`** — list all equipment from RDS (already partially done, needs fixes)
3. **GET `/api/equipment/[id]`** — fetch a single equipment item by ID for the detail/rental page
4. **POST `/api/equipment/[id]/book`** — create a booking in the existing `bookings` table
5. **Update `Equipment page.tsx`** — fix the broken useState/useEffect placement
6. **Update `EquipmentDetailView.tsx`** — fetch real equipment data by ID instead of hardcoded values

## Database Safety

> [!CAUTION]
> - NO `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `TRUNCATE`, or migrations
> - NO calls to `initDatabase()`
> - NO Prisma commands
> - All queries are read-only SELECTs (except the booking INSERT into the existing `bookings` table)

## Existing RDS Schema (source of truth)

```sql
-- equipment table
id              varchar(30) PK
name            varchar(100) NOT NULL
type            varchar(100) NOT NULL
owner           varchar(100) NOT NULL
location        varchar(255) NOT NULL
price_per_hour  decimal(10,2) NOT NULL
availability    tinyint(1) NOT NULL DEFAULT 1

-- bookings table  
id              varchar(30) PK
farmer_id       varchar(30) NOT NULL → FK farmers(id)
equipment_id    varchar(30) NOT NULL → FK equipment(id)
start_date      date NOT NULL
end_date        date NOT NULL
status          varchar(30) NOT NULL
```

---

## Proposed Changes

### 1. Fix `lib/db.ts` merge conflicts

#### [MODIFY] [db.ts](file:///c:/Users/LENOVO/Downloads/SIH/lib/db.ts)

The file currently contains Git merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`). This must be resolved first so the pool/query exports work. We'll keep the HEAD version (no hardcoded password fallback) and remove the dead `initDatabase()` function and all conflict markers.

---

### 2. Fix `Equipment page.tsx` — broken hooks

#### [MODIFY] [Equipment page.tsx](file:///c:/Users/LENOVO/Downloads/SIH/Equipment%20page%20Dashboard/Equipment%20page.tsx)

The `useState` and `useEffect` calls are currently at **module scope** (lines 22–29), outside the `EquipmentPage` component. React hooks can only be called inside a function component. Move them inside `export default function EquipmentPage()`. Also make the category counts dynamic based on fetched data.

---

### 3. Enhance `GET /api/equipment` route

#### [MODIFY] [route.ts](file:///c:/Users/LENOVO/Downloads/SIH/app/api/equipment/route.ts)

The existing route works but returns minimal data. Enhance it to also include `location` in the response so the UI can show it.

---

### 4. Create `GET /api/equipment/[id]` route

#### [NEW] `app/api/equipment/[id]/route.ts`

Returns a single equipment record by ID from the existing RDS `equipment` table. The `EquipmentDetailView` component will call this.

```ts
// GET /api/equipment/:id
// SELECT id, name, type, owner, location, price_per_hour, availability
// FROM equipment WHERE id = ?
```

---

### 5. Create `POST /api/equipment/[id]/book` route

#### [NEW] `app/api/equipment/[id]/book/route.ts`

Creates a booking in the existing `bookings` table. Accepts `farmer_id`, `start_date`, `end_date` in the request body. Generates a unique booking ID and inserts with `status = 'pending'`.

```ts
// POST /api/equipment/:id/book
// INSERT INTO bookings (id, farmer_id, equipment_id, start_date, end_date, status)
// VALUES (?, ?, ?, ?, ?, 'pending')
```

---

### 6. Update `EquipmentDetailView.tsx`

#### [MODIFY] [EquipmentDetailView.tsx](file:///c:/Users/LENOVO/Downloads/SIH/components/equipment/EquipmentDetailView.tsx)

Currently uses hardcoded values (name, rate, specs). Update to:
- Fetch `/api/equipment/{equipmentId}` on mount
- Display real data (name, type, owner, location, price_per_hour)
- Use `price_per_hour` from DB for the rental calculator
- Call `POST /api/equipment/{id}/book` when the user confirms a rental

---

## Verification Plan

### Automated
- `curl http://localhost:3000/api/equipment` → returns JSON array from RDS
- `curl http://localhost:3000/api/equipment/{id}` → returns single equipment record
- Verify no `CREATE TABLE` or `ALTER TABLE` queries in any changed file

### Manual
- Equipment listing page renders data from RDS
- Equipment detail page shows real data for a given ID
- Booking flow inserts into the existing `bookings` table
- No InsForge calls are made for equipment data
