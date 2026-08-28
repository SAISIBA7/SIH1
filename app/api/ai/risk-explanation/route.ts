import { NextRequest, NextResponse } from 'next/server';
import { generateRiskExplanation } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const context = {
      cropName: body.cropName || 'Paddy (Swarna)',
      riskScore: body.riskScore ?? 78,
      weatherRisk: body.weatherRisk ?? 68,
      marketRisk: body.marketRisk ?? 42,
      soilMoisture: body.soilMoisture || '24% (Deficit)',
      district: body.district || 'Mayurbhanj, Odisha'
    };

    const explanation = await generateRiskExplanation(context);
    return NextResponse.json({ success: true, data: explanation });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
