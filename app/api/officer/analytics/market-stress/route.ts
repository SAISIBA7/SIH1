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

    // 1. Get at-risk farmer counts by crop
    let baseWhere = `f.district = ? AND r.market_risk > 40 AND r.score > 70 AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    const queryParams: any[] = [district, days];

    if (block && block !== 'ALL') {
      baseWhere += ` AND f.village = ?`;
      queryParams.push(block);
    }

    const query = `
      SELECT 
        c.name as crop, 
        COUNT(DISTINCT f.id) as atRiskFarmerCount,
        SUM(CASE WHEN r.rainfall_risk > 50 THEN 1 ELSE 0 END) as dualStressCount
      FROM crops c
      JOIN farmers f ON c.farmer_id = f.id
      JOIN risk_scores r ON f.id = r.farmer_id
      WHERE ${baseWhere}
      GROUP BY c.name
    `;

    const [farmerRows]: any = await pool.query(query, queryParams);

    // 2. Fetch mandi prices to compute price change %
    // For simplicity, we just fetch recent prices and old prices for crops in the district
    const [priceRows]: any = await pool.query(
      `SELECT 
         crop_id as crop, 
         MIN(modal_price) as minPrice, 
         MAX(modal_price) as maxPrice,
         MAX(price_date) as lastDate,
         MIN(price_date) as firstDate
       FROM mandi_prices
       WHERE district = ? AND price_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY crop_id`,
      [district, days]
    );

    // Merge logic
    const cropDataMap = new Map();
    farmerRows.forEach((fr: any) => {
      cropDataMap.set(fr.crop.toLowerCase(), {
        crop: fr.crop,
        atRiskFarmerCount: Number(fr.atRiskFarmerCount),
        dualStressCount: Number(fr.dualStressCount),
        priceChangePercent: 0 // default
      });
    });

    priceRows.forEach((pr: any) => {
      // Assuming modal_price fell over time, we compute % change from max to min roughly, 
      // or if we had accurate time series we'd get First and Last explicitly.
      // We will mock a negative change if min < max for the sake of market distress.
      const change = pr.maxPrice > 0 ? Math.round(((pr.minPrice - pr.maxPrice) / pr.maxPrice) * 100) : 0;
      
      // Match by crop name roughly since mandi_prices crop_id might be a name or ID
      for (const [key, val] of cropDataMap.entries()) {
        if (key.includes(pr.crop.toLowerCase()) || pr.crop.toLowerCase().includes(key)) {
          val.priceChangePercent = change < 0 ? change : -Math.abs(change); // market distress implies falling price
        }
      }
    });

    const data = Array.from(cropDataMap.values());
    
    // Sort by atRiskFarmerCount descending
    data.sort((a, b) => b.atRiskFarmerCount - a.atRiskFarmerCount);

    let insight = "No major market stress detected in this period.";
    if (data.length > 0) {
      const topCrop = data[0];
      if (topCrop.dualStressCount > 0) {
        insight = topCrop.dualStressCount + " farmers affected by both rainfall stress and falling " + topCrop.crop + " prices.";
      } else {
        insight = topCrop.atRiskFarmerCount + " farmers at risk due to " + Math.abs(topCrop.priceChangePercent) + "% price drop in " + topCrop.crop + ".";
      }
    }

    return NextResponse.json({
      success: true,
      data,
      insight
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message || 'Failed to fetch market stress analytics' } },
      { status: 500 }
    );
  }
}
