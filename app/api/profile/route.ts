import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'admin' | 'bank';
  profile_id?: string;
  district?: string;
  village?: string;
  phone?: string;
  language?: string;
  land_area?: number;
  loan_amount?: number;
  bank_name?: string;
  designation?: string;
  created_at?: string;
}

const memoryProfiles: Map<string, UserProfile> = new Map([
  [
    'user-default',
    {
      id: 'user-default',
      email: 'farmer.ramesh@smartcrop.in',
      name: 'Ramesh Mohanty',
      role: 'farmer',
      profile_id: 'farmer-001',
      district: 'Mayurbhanj',
      village: 'Baripada Rural',
      phone: '+91 94371 88291',
      language: 'or',
      land_area: 4.8,
      loan_amount: 50000.00
    }
  ]
]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default';

    try {
      const rows = await query<any[]>(
        `SELECT u.id, u.email, u.name, u.role, u.profile_id, u.created_at,
                f.phone, f.district, f.village, f.language, f.land_area, f.loan_amount, f.loan_due_date
         FROM users u
         LEFT JOIN farmers f ON u.profile_id = f.id
         WHERE u.id = ?`,
        [userId]
      );

      if (rows.length > 0) {
        return NextResponse.json({ success: true, data: rows[0], source: 'aws_rds' });
      }
    } catch (dbErr) {
      console.warn('[API /api/profile] RDS query fallback:', dbErr);
    }

    const fallbackProfile = memoryProfiles.get(userId) || memoryProfiles.get('user-default');
    return NextResponse.json({
      success: true,
      data: fallbackProfile,
      source: 'fallback_cache'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      email,
      name,
      role = 'farmer',
      phone,
      district,
      village,
      language = 'en',
      land_area = 0,
      loan_amount = 0,
      bank_name,
      designation
    } = body;

    const id = userId || `user-${Date.now()}`;
    const profileId = role === 'farmer' ? `farmer-${Date.now()}` : `officer-${Date.now()}`;

    const profileData: UserProfile = {
      id,
      email: email || '',
      name: name || 'User',
      role: role as 'farmer' | 'admin' | 'bank',
      profile_id: profileId,
      phone,
      district,
      village,
      language,
      land_area: Number(land_area) || 0,
      loan_amount: Number(loan_amount) || 0,
      bank_name,
      designation,
      created_at: new Date().toISOString()
    };

    try {
      // 1. Save user
      await query(`
        INSERT INTO users (id, email, name, role, profile_id)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          email = VALUES(email),
          name = VALUES(name),
          role = VALUES(role),
          profile_id = VALUES(profile_id)
      `, [id, email, name, role, profileId]);

      // 2. If farmer, insert/update farmers table matching exact schema
      if (role === 'farmer') {
        await query(`
          INSERT INTO farmers (id, name, phone, district, village, language, land_area, loan_amount, loan_due_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            phone = VALUES(phone),
            district = VALUES(district),
            village = VALUES(village),
            language = VALUES(language),
            land_area = VALUES(land_area),
            loan_amount = VALUES(loan_amount)
        `, [profileId, name, phone || '', district || '', village || '', language, land_area, loan_amount, null]);
      }

      memoryProfiles.set(id, profileData);
      return NextResponse.json({ success: true, data: profileData, source: 'aws_rds' }, { status: 201 });
    } catch (dbErr) {
      console.warn('[API POST /api/profile] RDS save fallback:', dbErr);
      memoryProfiles.set(id, profileData);
      return NextResponse.json({ success: true, data: profileData, source: 'fallback_cache' }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
