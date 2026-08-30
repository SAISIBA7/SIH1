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

    let baseWhere = `f.district = ? AND r.score > 70 AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    const queryParams: any[] = [district, days];

    if (block && block !== 'ALL') {
      baseWhere += ` AND f.village = ?`;
      queryParams.push(block);
    }

    const query = `
      SELECT 
        SUM(CASE WHEN r.rainfall_risk > 50 AND r.market_risk <= 40 AND r.loan_risk <= 40 THEN 1 ELSE 0 END) as weatherOnly,
        SUM(CASE WHEN r.market_risk > 40 AND r.rainfall_risk <= 50 AND r.loan_risk <= 40 THEN 1 ELSE 0 END) as marketOnly,
        SUM(CASE WHEN r.loan_risk > 40 AND r.rainfall_risk <= 50 AND r.market_risk <= 40 THEN 1 ELSE 0 END) as loanOnly,
        SUM(CASE WHEN r.rainfall_risk > 50 AND r.market_risk > 40 AND r.loan_risk <= 40 THEN 1 ELSE 0 END) as weatherAndMarket,
        SUM(CASE WHEN r.rainfall_risk > 50 AND r.loan_risk > 40 AND r.market_risk <= 40 THEN 1 ELSE 0 END) as weatherAndLoan,
        SUM(CASE WHEN r.market_risk > 40 AND r.loan_risk > 40 AND r.rainfall_risk <= 50 THEN 1 ELSE 0 END) as marketAndLoan,
        SUM(CASE WHEN r.rainfall_risk > 50 AND r.market_risk > 40 AND r.loan_risk > 40 THEN 1 ELSE 0 END) as allThree
      FROM risk_scores r
      JOIN farmers f ON r.farmer_id = f.id
      WHERE ${baseWhere}
    `;

    const [rows]: any = await pool.query(query, queryParams);

    const data = rows[0] ? {
      weatherOnly: Number(rows[0].weatherOnly),
      marketOnly: Number(rows[0].marketOnly),
      loanOnly: Number(rows[0].loanOnly),
      weatherAndMarket: Number(rows[0].weatherAndMarket),
      weatherAndLoan: Number(rows[0].weatherAndLoan),
      marketAndLoan: Number(rows[0].marketAndLoan),
      allThree: Number(rows[0].allThree)
    } : {
      weatherOnly: 0, marketOnly: 0, loanOnly: 0,
      weatherAndMarket: 0, weatherAndLoan: 0, marketAndLoan: 0, allThree: 0
    };

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch combined risk analytics' } },
      { status: 500 }
    );
  }
}
