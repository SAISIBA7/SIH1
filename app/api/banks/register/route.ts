import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Generates a bank id like 'bank_lx3k9f2a7bq1x' — alphanumeric,
 * max ~19 chars, fitting the VARCHAR(30) PK convention used
 * across the existing sih schema.
 */
function generateBankId(): string {
  return `bank_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const DUPLICATE_EMAIL_MSG =
  'This official email is already registered. Please use a different email or contact support.';

export async function POST(req: Request) {
  try {
    // ---- Parse body ----
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body — expected JSON.' },
        { status: 400 }
      );
    }

    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

    const bankName = str(body.bankName);
    const institutionType = str(body.institutionType);
    const website = str(body.website);
    const email = str(body.email).toLowerCase();
    const phone = str(body.phone);
    const registeredAddress = str(body.hq); // form field 'hq' -> DB registered_address
    const state = str(body.state);
    const district = str(body.district);
    const description = str(body.description);

    // ---- 1. Required-field validation ----
    const required: Array<[string, string]> = [
      ['bankName', bankName],
      ['institutionType', institutionType],
      ['website', website],
      ['officialEmail', email],
      ['officialPhone', phone],
      ['registeredAddress', registeredAddress],
      ['state', state],
      ['district', district],
      ['description', description],
    ];
    const missing = required.filter(([, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required field(s): ${missing.join(', ')}.` },
        { status: 400 }
      );
    }

    // ---- 2. Basic format validation ----
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Official email is not a valid email address.' },
        { status: 400 }
      );
    }
    if (!/^https?:\/\/.+/i.test(website)) {
      return NextResponse.json(
        { error: 'Official website must be a valid URL starting with http:// or https://.' },
        { status: 400 }
      );
    }

    // ---- 3. Duplicate official_email check (UNIQUE constraint is the backstop) ----
    const existing = await query<Record<string, unknown>[]>(
      'SELECT id FROM banks WHERE official_email = ?',
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: DUPLICATE_EMAIL_MSG }, { status: 409 });
    }

    // ---- 4. Insert ----
    const id = generateBankId();
    await query(
      `INSERT INTO banks
         (id, bank_name, institution_type, official_website, official_email,
          official_phone, description, registered_address, state, district,
          verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')`,
      [id, bankName, institutionType, website, email, phone, description,
       registeredAddress, state, district]
    );

    return NextResponse.json(
      {
        message: 'Bank registration submitted successfully. It is now pending Smart Crop administrator review.',
        bankId: id,
        verificationStatus: 'submitted',
      },
      { status: 201 }
    );
  } catch (err: any) {
    // Backstop for race-condition duplicate inserts (UNIQUE constraint fires)
    if (err?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: DUPLICATE_EMAIL_MSG }, { status: 409 });
    }
    console.error('[api/banks/register] POST failed:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Registration failed due to a server error. Please try again.' },
      { status: 500 }
    );
  }
}
