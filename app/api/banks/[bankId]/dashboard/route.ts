import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bankId: string }> }
) {
  try {
    // This Next.js version passes route params as a Promise
    const { bankId } = await params;

    // ---- 1. Bank profile (404 if not found) ----
    const bankRows = await query<Record<string, any>[]>(
      `SELECT id, bank_name, institution_type, verification_status, state, district
       FROM banks WHERE id = ?`,
      [bankId]
    );
    if (bankRows.length === 0) {
      return NextResponse.json(
        { error: `No bank found with id "${bankId}".` },
        { status: 404 }
      );
    }
    const bank = bankRows[0];

    // ---- 2. Facility counts grouped by status ----
    const statusRows = await query<{ status: string; count: number }[]>(
      'SELECT status, COUNT(*) AS count FROM financial_facilities WHERE bank_id = ? GROUP BY status',
      [bankId]
    );
    const statusCounts: Record<string, number> = {};
    let total = 0;
    for (const row of statusRows) {
      statusCounts[row.status] = Number(row.count);
      total += Number(row.count);
    }

    // ---- 3. Five most recent facilities ----
    const recent = await query<Record<string, any>[]>(
      `SELECT id, facility_name, facility_type, status, interest_rate, updated_at
       FROM financial_facilities
       WHERE bank_id = ?
       ORDER BY updated_at DESC
       LIMIT 5`,
      [bankId]
    );

    return NextResponse.json({
      bank: {
        id: bank.id,
        bankName: bank.bank_name,
        institutionType: bank.institution_type,
        verificationStatus: bank.verification_status,
        state: bank.state,
        district: bank.district,
      },
      counts: {
        total,
        published: statusCounts['published'] ?? 0,
        draft: statusCounts['draft'] ?? 0,
        // Both are "in the review pipeline" from the bank's perspective
        underReview: (statusCounts['under_review'] ?? 0) + (statusCounts['submitted'] ?? 0),
      },
      statusCounts, // raw per-status counts — available for future UI refinement
      recentFacilities: recent.map(f => ({
        id: f.id,
        facilityName: f.facility_name,
        facilityType: f.facility_type,
        status: f.status,
        interestRate: f.interest_rate,
        updatedAt: f.updated_at,
      })),
    });
  } catch (err: any) {
    console.error('[api/banks/[bankId]/dashboard] GET failed:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Failed to load dashboard data. Please try again.' },
      { status: 500 }
    );
  }
}
