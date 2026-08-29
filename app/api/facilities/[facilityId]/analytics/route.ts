import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_EVENT_TYPES = new Set(['VIEW', 'TERMS_VIEW', 'APPLY_CLICK']);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ facilityId: string }> }
) {
  try {
    const { facilityId } = await params;
    if (!facilityId) {
      return NextResponse.json({ error: 'Facility ID is required.' }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body — expected JSON.' }, { status: 400 });
    }

    const eventType = typeof body.eventType === 'string' ? body.eventType.trim().toUpperCase() : '';
    if (!eventType || !VALID_EVENT_TYPES.has(eventType)) {
      return NextResponse.json(
        { error: `Invalid eventType "${eventType}". Valid types: ${[...VALID_EVENT_TYPES].join(', ')}.` },
        { status: 400 }
      );
    }

    // Check facility exists to satisfy foreign key requirement
    const facRows = await query<Record<string, any>[]>(
      'SELECT id FROM financial_facilities WHERE id = ?',
      [facilityId]
    );
    if (facRows.length === 0) {
      return NextResponse.json({ error: `No facility found with id "${facilityId}".` }, { status: 404 });
    }

    const farmerLocation =
      typeof body.farmerLocation === 'string' && body.farmerLocation.trim()
        ? body.farmerLocation.trim().slice(0, 200)
        : null;

    await query(
      'INSERT INTO facility_analytics (facility_id, event_type, farmer_location) VALUES (?, ?, ?)',
      [facilityId, eventType, farmerLocation]
    );

    return NextResponse.json({ success: true, eventType, facilityId }, { status: 201 });
  } catch (err: any) {
    console.error('[api/facilities/[facilityId]/analytics] POST failed:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Failed to record analytics event.' },
      { status: 500 }
    );
  }
}
