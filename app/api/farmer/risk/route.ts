import { NextResponse } from 'next/server';

export async function GET() {
  const riskData = {
    farmerId: 'FRM-7821',
    overallScore: 78,
    riskLevel: 'HIGH',
    calculatedAt: new Date().toISOString(),
    factors: [
      { name: 'Weather Stress (Rainfall Deficit)', score: 68, max: 100, level: 'HIGH', trend: 'increasing', detail: '22% deficit in 14-day cumulative rainfall.' },
      { name: 'Market Price Volatility', score: 42, max: 100, level: 'MEDIUM', trend: 'stable', detail: 'Wholesale arrival surge expected within 10 days.' },
      { name: 'Soil Moisture Depletion', score: 64, max: 100, level: 'HIGH', trend: 'increasing', detail: 'Soil moisture dropped from 38% to 26% across top 15cm.' },
      { name: 'Pest & Disease Vector', score: 22, max: 100, level: 'LOW', trend: 'decreasing', detail: 'Brown plant hopper activity within permissible threshold.' },
      { name: 'Credit & Financial Pressure', score: 35, max: 100, level: 'LOW', trend: 'stable', detail: 'KCC repayment due on 2026-11-30. Interest subvention active.' }
    ],
    history: [
      { date: 'Aug 14', score: 35 },
      { date: 'Aug 17', score: 42 },
      { date: 'Aug 20', score: 58 },
      { date: 'Aug 23', score: 69 },
      { date: 'Aug 26', score: 75 },
      { date: 'Today', score: 78 }
    ]
  };

  return NextResponse.json({ success: true, data: riskData });
}
