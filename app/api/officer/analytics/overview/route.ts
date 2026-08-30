import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { extractBearerToken, verifyJwt } from '@/lib/auth-jwt';

// Helper to resolve current officer user
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
    const { userId, district } = await getOfficerUser(req);

    // 1. High Risk Farmers Count
    const [highRiskRows]: any = await pool.query(
      `SELECT COUNT(DISTINCT r.farmer_id) as count
       FROM risk_scores r
       JOIN farmers f ON r.farmer_id = f.id
       WHERE f.district = ? AND r.score > 70`,
      [district]
    );
    const highRiskCount = highRiskRows[0]?.count || 0;

    // Previous 7 days count for delta (assuming 7 days period)
    const [prevHighRiskRows]: any = await pool.query(
      `SELECT COUNT(DISTINCT r.farmer_id) as count
       FROM risk_scores r
       JOIN farmers f ON r.farmer_id = f.id
       WHERE f.district = ? AND r.score > 70 AND r.created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [district]
    );
    const prevHighRiskCount = prevHighRiskRows[0]?.count || 0;
    const highRiskDelta = highRiskCount - prevHighRiskCount;

    // 2. Moderate Risk Farmers Count
    const [moderateRiskRows]: any = await pool.query(
      `SELECT COUNT(DISTINCT r.farmer_id) as count
       FROM risk_scores r
       JOIN farmers f ON r.farmer_id = f.id
       WHERE f.district = ? AND r.score > 30 AND r.score <= 70`,
      [district]
    );
    const moderateRiskCount = moderateRiskRows[0]?.count || 0;

    // 3. Active Distress Alerts
    const [alertRows]: any = await pool.query(
      `SELECT COUNT(*) as count
       FROM notifications n
       JOIN farmers f ON n.farmer_id = f.id
       WHERE f.district = ? AND n.priority = 'critical' AND n.is_read = FALSE`,
      [district]
    );
    const activeAlertsCount = alertRows[0]?.count || 0;

    // 4. Pending Interventions
    const [interventionRows]: any = await pool.query(
      `SELECT COUNT(*) as count
       FROM officer_interventions i
       JOIN farmers f ON i.farmer_id = f.id
       WHERE f.district = ? AND i.status IN ('SCHEDULED', 'IN_PROGRESS') AND i.officer_id = ?`,
      [district, userId]
    );
    const pendingInterventionsCount = interventionRows[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        highRiskFarmers: {
          count: highRiskCount,
          delta: highRiskDelta,
          deltaPercent: prevHighRiskCount > 0 ? Math.round((highRiskDelta / prevHighRiskCount) * 100) : 0
        },
        moderateRiskFarmers: {
          count: moderateRiskCount
        },
        activeDistressAlerts: {
          count: activeAlertsCount
        },
        pendingInterventions: {
          count: pendingInterventionsCount
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch analytics overview' } },
      { status: 500 }
    );
  }
}
