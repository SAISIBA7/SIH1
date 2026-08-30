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

    const days = parseInt(timeRange.replace('d', '')) || 7;

    const query = `
      SELECT 
        f.village as block,
        COUNT(DISTINCT f.id) as totalFarmers,
        ROUND(AVG(r.score), 1) as avgScore,
        SUM(CASE WHEN r.score > 70 THEN 1 ELSE 0 END) as highRiskCount,
        SUM(CASE WHEN r.score > 30 AND r.score <= 70 THEN 1 ELSE 0 END) as moderateRiskCount,
        SUM(CASE WHEN r.rainfall_risk >= r.market_risk AND r.rainfall_risk >= r.loan_risk THEN 1 ELSE 0 END) as weatherCount,
        SUM(CASE WHEN r.market_risk > r.rainfall_risk AND r.market_risk >= r.loan_risk THEN 1 ELSE 0 END) as marketCount,
        SUM(CASE WHEN r.loan_risk > r.rainfall_risk AND r.loan_risk > r.market_risk THEN 1 ELSE 0 END) as loanCount
      FROM farmers f
      LEFT JOIN (
        SELECT farmer_id, MAX(score) as score, MAX(rainfall_risk) as rainfall_risk, MAX(market_risk) as market_risk, MAX(loan_risk) as loan_risk
        FROM risk_scores
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY farmer_id
      ) r ON f.id = r.farmer_id
      WHERE f.district = ?
      GROUP BY f.village
      ORDER BY avgScore DESC
    `;

    const [rows]: any = await pool.query(query, [days, district]);

    const data = rows.map((row: any) => {
      let primaryFactor = 'Unknown';
      let maxCount = 0;
      
      if (row.weatherCount >= row.marketCount && row.weatherCount >= row.loanCount) {
        primaryFactor = 'Weather / Rainfall';
        maxCount = row.weatherCount;
      } else if (row.marketCount > row.weatherCount && row.marketCount >= row.loanCount) {
        primaryFactor = 'Market Prices';
        maxCount = row.marketCount;
      } else if (row.loanCount > row.weatherCount && row.loanCount > row.marketCount) {
        primaryFactor = 'Loan Proximity';
        maxCount = row.loanCount;
      }

      return {
        block: row.block || 'Unknown',
        totalFarmers: Number(row.totalFarmers) || 0,
        avgScore: Number(row.avgScore) || 0,
        highRiskCount: Number(row.highRiskCount) || 0,
        moderateRiskCount: Number(row.moderateRiskCount) || 0,
        primaryFactor: maxCount > 0 ? primaryFactor : 'None'
      };
    });

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch heatmap data' } },
      { status: 500 }
    );
  }
}
