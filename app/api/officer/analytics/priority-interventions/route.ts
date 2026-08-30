import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { extractBearerToken, verifyJwt } from '@/lib/auth-jwt';

async function getOfficerUser(req: NextRequest) {
  let userId = 'usr_admin_demo_1';
  let district = 'Mayurbhanj';

  const token = extractBearerToken(req) || req.cookies.get('smartcrop_token')?.value;
  if (token) {
    const verified = verifyJwt(token);
    if (verified.valid && verified.payload) {
      userId = verified.payload.id || userId;
    }
  } else {
    const sessionCookie = req.cookies.get('smartcrop_session')?.value;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie));
        if (parsed?.id) userId = parsed.id;
      } catch {}
    }
  }
  return { userId, district };
}

export async function GET(req: NextRequest) {
  try {
    const { district } = await getOfficerUser(req);
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const block = searchParams.get('block');
    const limit = parseInt(searchParams.get('limit') || '5');

    const days = parseInt(timeRange.replace('d', '')) || 7;

    let baseWhere = `f.district = ? AND r.score > 70 AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    const queryParams: any[] = [district, days];

    if (block && block !== 'ALL') {
      baseWhere += ` AND f.village = ?`;
      queryParams.push(block);
    }

    // Include the LIMIT parameter at the end
    queryParams.push(limit);

    const query = `
      SELECT 
        f.id,
        f.name,
        f.phone,
        f.village as block,
        r.score as distressScore,
        c.name as crop,
        r.rainfall_risk,
        r.market_risk,
        r.loan_risk
      FROM risk_scores r
      JOIN farmers f ON r.farmer_id = f.id
      LEFT JOIN crops c ON c.farmer_id = f.id
      WHERE ${baseWhere}
      ORDER BY r.score DESC
      LIMIT ?
    `;

    const [rows]: any = await pool.query(query, queryParams);

    const data = rows.map((r: any) => {
      const primaryFactors = [];
      if (r.rainfall_risk > 50) primaryFactors.push('Rainfall Drop');
      if (r.market_risk > 40) primaryFactors.push('Market Price Drop');
      if (r.loan_risk > 40) primaryFactors.push('Loan Due Soon');
      if (primaryFactors.length === 0) primaryFactors.push('Pest / Soil Risk');

      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        block: r.block,
        crop: r.crop || 'Unknown',
        distressScore: r.distressScore,
        primaryFactor: primaryFactors.join(', '),
        interventionStatus: 'Needs Action'
      };
    });

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch priority interventions' } },
      { status: 500 }
    );
  }
}
