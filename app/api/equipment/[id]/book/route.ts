import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { farmer_id, start_date, end_date } = body;

    if (!farmer_id || !start_date || !end_date) {
      return NextResponse.json({ error: 'farmer_id, start_date, and end_date are required' }, { status: 400 });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json({ error: 'end_date cannot be before start_date' }, { status: 400 });
    }

    // 1. Confirm equipment exists and is available
    const eqRows = await query<any>(
      `SELECT id, availability FROM equipment WHERE id = ?`,
      [id]
    );

    if (!eqRows || eqRows.length === 0) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    if (eqRows[0].availability !== 1) {
      return NextResponse.json({ error: 'Equipment is not currently available' }, { status: 409 });
    }

    // 2. Check for overlapping bookings against existing rows in DB
    const overlappingBookings = await query<any>(
      `
      SELECT b.id 
      FROM bookings b 
      WHERE b.equipment_id = ? 
        AND b.status IN ('pending', 'confirmed') 
        AND b.start_date <= ? -- b.start_date <= requestedEndDate
        AND b.end_date >= ?   -- b.end_date >= requestedStartDate
      LIMIT 1
      `,
      [id, end_date, start_date]
    );

    if (overlappingBookings && overlappingBookings.length > 0) {
      return NextResponse.json({ error: 'Equipment is already booked for the selected dates' }, { status: 409 });
    }

    // 3. Generate booking ID
    const timestamp = Date.now();
    const bookingId = `BKG_${timestamp.toString().slice(-8)}_${Math.floor(100 + Math.random() * 900)}`;

    // 4. Insert booking
    await query(
      `
      INSERT INTO bookings (id, farmer_id, equipment_id, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
      `,
      [bookingId, farmer_id, id, start_date, end_date]
    );

    return NextResponse.json({ success: true, bookingId });
  } catch (error: any) {
    console.error(`[API /api/equipment/[id]/book] Error booking equipment:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
