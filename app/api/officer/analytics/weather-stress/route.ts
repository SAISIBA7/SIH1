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

    let baseWhere = `f.district = ? AND w.recorded_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    const queryParams: any[] = [district, days];

    if (block && block !== 'ALL') {
      baseWhere += ` AND f.village = ?`;
      queryParams.push(block);
    }

    // Average rainfall deviation
    // Since weather_observations doesn't explicitly have historical averages (just forecast vs actual or daily actual),
    // we compute deviation as (rainfall - forecast_rainfall) / forecast_rainfall
    const query = `
      SELECT 
        AVG((w.rainfall - w.forecast_rainfall) / NULLIF(w.forecast_rainfall, 0)) * 100 as avgDeviation,
        COUNT(DISTINCT w.farm_id) as affectedFarms,
        f.village as block
      FROM weather_observations w
      JOIN farms fa ON w.farm_id = fa.id
      JOIN farmers f ON fa.farmer_id = f.id
      WHERE ${baseWhere}
      GROUP BY f.village
      ORDER BY avgDeviation ASC
    `;

    const [rows]: any = await pool.query(query, queryParams);

    // Sum overall stats
    let totalDeviation = 0;
    let totalAffected = 0;
    let mostAffectedBlock = 'Unknown';
    let minDeviation = 0;

    rows.forEach((r: any) => {
      const dev = Number(r.avgDeviation);
      if (dev < minDeviation) {
        minDeviation = dev;
        mostAffectedBlock = r.block;
      }
      totalAffected += Number(r.affectedFarms);
      totalDeviation += dev;
    });

    const avgDistressDeviation = rows.length > 0 ? Math.round(totalDeviation / rows.length) : 0;

    // High risk farmers associated with weather stress
    const [riskRows]: any = await pool.query(
      `SELECT COUNT(DISTINCT r.farmer_id) as count, c.name as mostAffectedCrop
       FROM risk_scores r
       JOIN farmers f ON r.farmer_id = f.id
       LEFT JOIN crops c ON c.farmer_id = f.id
       WHERE f.district = ? AND r.rainfall_risk > 50 AND r.score > 70
       GROUP BY c.name
       ORDER BY count DESC LIMIT 1`,
      [district]
    );

    const highRiskWeatherFarmers = riskRows.length > 0 ? Number(riskRows[0].count) : 0;
    const mostAffectedCrop = riskRows.length > 0 ? riskRows[0].mostAffectedCrop : 'Paddy';

    // Small comparison data for the chart (Expected vs Actual Rainfall)
    const [chartRows]: any = await pool.query(
      `SELECT 
         DATE(w.recorded_at) as date,
         AVG(w.forecast_rainfall) as expected,
         AVG(w.rainfall) as actual
       FROM weather_observations w
       JOIN farms fa ON w.farm_id = fa.id
       JOIN farmers f ON fa.farmer_id = f.id
       WHERE ${baseWhere}
       GROUP BY DATE(w.recorded_at)
       ORDER BY date ASC`,
      queryParams
    );

    const chartData = chartRows.map((r: any) => ({
      date: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
      expected: Number(r.expected),
      actual: Number(r.actual)
    }));

    return NextResponse.json({
      success: true,
      data: {
        rainfallDeviationPercent: avgDistressDeviation,
        farmersAffected: totalAffected,
        highRiskFarmers: highRiskWeatherFarmers,
        mostAffectedCrop: mostAffectedCrop || 'Unknown',
        mostAffectedBlock: mostAffectedBlock,
        chartData
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch weather stress analytics' } },
      { status: 500 }
    );
  }
}
