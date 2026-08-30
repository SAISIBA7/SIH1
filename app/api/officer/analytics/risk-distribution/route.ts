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

    const days = parseInt(timeRange.replace('d', '')) || 7;

    let baseWhere = `f.district = ? AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    const queryParams: any[] = [district, days];

    if (block && block !== 'ALL') {
      baseWhere += ` AND f.village = ?`;
      queryParams.push(block);
    }

    // We take the latest risk score per farmer within the time window to count accurately
    const query = `
      SELECT 
        SUM(CASE WHEN max_score > 70 THEN 1 ELSE 0 END) as highCount,
        SUM(CASE WHEN max_score > 30 AND max_score <= 70 THEN 1 ELSE 0 END) as moderateCount,
        SUM(CASE WHEN max_score <= 30 THEN 1 ELSE 0 END) as lowCount
      FROM (
        SELECT r.farmer_id, MAX(r.score) as max_score
        FROM risk_scores r
        JOIN farmers f ON r.farmer_id = f.id
        WHERE ${baseWhere}
        GROUP BY r.farmer_id
      ) as latest_scores
    `;

    const [rows]: any = await pool.query(query, queryParams);

    const data = {
      high: rows[0]?.highCount || 0,
      moderate: rows[0]?.moderateCount || 0,
      low: rows[0]?.lowCount || 0
    };

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch risk distribution' } },
      { status: 500 }
    );
  }
}
