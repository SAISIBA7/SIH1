import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = new Set([
  'draft', 'submitted', 'under_review', 'approved',
  'published', 'unpublished', 'expired', 'suspended', 'deleted',
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ facilityId: string }> }
) {
  try {
    // This Next.js version passes route params as a Promise
    const { facilityId } = await params;

    // ---- 1. Parse & validate requested status ----
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body — expected JSON.' }, { status: 400 });
    }
    const next = typeof body.status === 'string' ? body.status.trim().toLowerCase() : '';
    if (!next) {
      return NextResponse.json({ error: 'Missing required field: status.' }, { status: 400 });
    }
    if (!VALID_STATUSES.has(next)) {
      return NextResponse.json(
        { error: `Invalid status "${next}". Valid values: ${[...VALID_STATUSES].join(', ')}.` },
        { status: 400 }
      );
    }

    // ---- 2. Integrity guard: 'suspended' is an admin-only sanction (PRD 4.3) ----
    if (next === 'suspended') {
      return NextResponse.json(
        { error: 'Facilities cannot be suspended from this endpoint — suspension is a Smart Crop administrator action.' },
        { status: 409 }
      );
    }

    // ---- 3. Facility existence check (404 if not found) ----
    const rows = await query<Record<string, any>[]>(
      'SELECT id, status FROM financial_facilities WHERE id = ?',
      [facilityId]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: `No facility found with id "${facilityId}".` }, { status: 404 });
    }
    const current = rows[0].status as string;

    // ---- 4. Integrity guard: suspended/expired/deleted are terminal from this endpoint ----
    if (current === 'suspended' || current === 'expired' || current === 'deleted') {
      return NextResponse.json(
        { error: `Facility is ${current} — this state cannot be modified from this endpoint.` },
        { status: 409 }
      );
    }

    // ---- 5. Idempotent no-op: same → same is a harmless success ----
    if (current === next) {
      return NextResponse.json({ facilityId, status: current, message: 'Status unchanged.' });
    }

    // ---- 6. Update (updated_at auto-bumps via ON UPDATE CURRENT_TIMESTAMP) ----
    await query('UPDATE financial_facilities SET status = ? WHERE id = ?', [next, facilityId]);

    const updated = await query<{ updated_at: string }[]>(
      'SELECT updated_at FROM financial_facilities WHERE id = ?',
      [facilityId]
    );

    return NextResponse.json({
      facilityId,
      status: next,
      updatedAt: updated[0]?.updated_at ?? null,
    });
  } catch (err: any) {
    console.error('[api/facilities/[facilityId]/status] PATCH failed:', err?.message ?? err);
    return NextResponse.json({ error: 'Status update failed due to a server error.' }, { status: 500 });
  }
}
