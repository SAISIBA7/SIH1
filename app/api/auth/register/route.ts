import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      username, 
      password, 
      fullName, 
      name,
      email, 
      mobileNumber, 
      phone,
      role = 'farmer',
      state = 'Odisha',
      district = 'Mayurbhanj',
      village = 'Baripada',
      landArea = 3.5,
      soilType = 'Red Loamy',
      currentCrop = 'Rice / Paddy',
      sowingDate = new Date().toISOString().split('T')[0],
      preferredLanguage = 'English',
      language = 'en',
      metadata = {}
    } = body;

    const finalPhone = (mobileNumber || phone || '').replace(/\D/g, '').slice(-10);
    const finalEmail = email ? email.trim().toLowerCase() : null;
    const finalName = (fullName || name || username || 'Smart Crop User').trim();
    const parsedArea = parseFloat(String(landArea)) || 3.50;

    if ((!finalPhone && !finalEmail && !username) || !password) {
      return NextResponse.json(
        { error: { code: "validation_error", message: "Mobile number/email and password are required." } },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: { code: "validation_error", message: "Password must be at least 6 characters." } },
        { status: 400 }
`      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const timestamp = Date.now();
    const farmerId = `FRM_${timestamp.toString().slice(-8)}_${Math.floor(100 + Math.random() * 900)}`;
    const farmId = `FRM_LAND_${timestamp.toString().slice(-8)}`;
    const cropId = `CRP_${timestamp.toString().slice(-8)}`;

    const connection = await pool.getConnection();

    try {
      // 1. Check duplicate phone in `farmers`
`      if (finalPhone) {
        const [existing]: any = await connection.query(
          'SELECT id FROM farmers WHERE phone = ? LIMIT 1;',
          [finalPhone]
        );

        if (existing && existing.length > 0) {
          return NextResponse.json(
            { error: { code: "duplicate_user", message: "A farmer with this mobile number already exists." } },
            { status: 409 }
          );
        }
      }

      await connection.beginTransaction();

      // 2. Insert into `farmers`
      await connection.query(
        `INSERT INTO farmers (id, name, phone, email, password_hash, district, village, language, land_area, state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          farmerId,
          finalName,
          finalPhone || `943${timestamp.toString().slice(-7)}`,
          finalEmail,
          hashedPassword,
          district || 'Mayurbhanj',
          village || 'Baripada',
          preferredLanguage || language || 'en',
          parsedArea,
          state || 'Odisha',
        ]
      );

      // 3. Insert into `farms`
      await connection.query(
        `INSERT INTO farms (id, farmer_id, name, latitude, longitude, area, soil_type, village, district)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          farmId,
          farmerId,
          `${finalName}'s Farm`,
          21.9322000,
          86.7483000,
          parsedArea,
          soilType || 'Red Loamy',
          village || 'Baripada',
          district || 'Mayurbhanj',
        ]
      );

      // 4. Insert into `crops`
      await connection.query(
        `INSERT INTO crops (id, farmer_id, name, stage, sowing_date)
         VALUES (?, ?, ?, ?, ?);`,
        [
          cropId,
          farmerId,
          currentCrop || 'Rice / Paddy',
          'Vegetative',
          sowingDate && /^\d{4}-\d{2}-\d{2}$/.test(sowingDate) ? sowingDate : new Date().toISOString().split('T')[0],
        ]
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "User registered successfully and stored in AWS RDS (farmers, farms, crops).",
        userId: farmerId,
        farmerId,
        farmId,
        cropId,
        role,
        user: {
          id: farmerId,
          fullName: finalName,
          email: finalEmail,
          mobileNumber: finalPhone,
          role,
          district,
          village,
          state,
          landArea: parsedArea,
          currentCrop
        }
      }, { status: 201 });

    } catch (dbErr: any) {
      await connection.rollback();
      console.error('[RDS User Registration DB Error]:', dbErr);
      return NextResponse.json(
        { error: { code: "database_error", message: dbErr.message || "Failed to save user to database." } },
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "registration_error", message: err.message || "Registration failed." } },
      { status: 500 }
    );
  }
}
