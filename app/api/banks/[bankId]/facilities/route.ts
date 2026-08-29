import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = new Set([
  'draft', 'submitted', 'under_review', 'approved',
  'published', 'unpublished', 'expired', 'suspended',
]);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bankId: string }> }
) {
  try {
    // This Next.js version passes route params as a Promise
    const { bankId } = await params;

    // ---- 1. Bank existence check (404 if not found) ----
    const bankRows = await query<Record<string, any>[]>(
      'SELECT id, bank_name FROM banks WHERE id = ?',
      [bankId]
    );
    if (bankRows.length === 0) {
      return NextResponse.json(
        { error: `No bank found with id "${bankId}".` },
        { status: 404 }
      );
    }

    // ---- 2. Optional status filter (?status=draft) ----
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    if (statusFilter && !VALID_STATUSES.has(statusFilter)) {
      return NextResponse.json(
        { error: `Invalid status filter "${statusFilter}". Valid values: ${[...VALID_STATUSES].join(', ')}.` },
        { status: 400 }
      );
    }

    // ---- 3. ALL non-deleted facilities for the bank (tenure included for card display) ----
    const sql = `SELECT id, facility_name, facility_type, status, minimum_amount, maximum_amount,
                        interest_rate, tenure, created_at, updated_at
                 FROM financial_facilities
                 WHERE bank_id = ? AND status != 'deleted'${statusFilter ? ' AND status = ?' : ''}
                 ORDER BY updated_at DESC`;
    const rows = await query<Record<string, any>[]>(
      sql,
      statusFilter ? [bankId, statusFilter] : [bankId]
    );

    return NextResponse.json({
      bank: { id: bankRows[0].id, bankName: bankRows[0].bank_name },
      count: rows.length,
      facilities: rows.map(f => ({
        id: f.id,
        facilityName: f.facility_name,
        facilityType: f.facility_type,
        status: f.status,
        minimumAmount: f.minimum_amount,
        maximumAmount: f.maximum_amount,
        interestRate: f.interest_rate,
        tenure: f.tenure,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
      })),
    });
  } catch (err: any) {
    console.error('[api/banks/[bankId]/facilities] GET failed:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Failed to load facilities. Please try again.' },
      { status: 500 }
    );
  }
}
