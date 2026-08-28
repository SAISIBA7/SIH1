import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    summary: {
      totalFarmers: 1420,
      criticalRiskCount: 38,
      mediumRiskCount: 164,
      lowRiskCount: 1218,
      activeInterventions: 19,
      pendingAlerts: 7,
      district: 'Mayurbhanj (Baripada Subdivision)'
    },
    riskTrends: [
      { month: 'May', critical: 12, medium: 95 },
      { month: 'Jun', critical: 18, medium: 120 },
      { month: 'Jul', critical: 24, medium: 140 },
      { month: 'Aug', critical: 38, medium: 164 }
    ],
    distressClusters: [
      { block: 'Baripada Block', distressLevel: 'HIGH', farmersAtRisk: 14, primaryCause: 'Rainfall Deficit (-26%)' },
      { block: 'Betnoti Block', distressLevel: 'HIGH', farmersAtRisk: 11, primaryCause: 'Soil Salinity & Moisture Depletion' },
      { block: 'Badasahi Block', distressLevel: 'MEDIUM', farmersAtRisk: 8, primaryCause: 'Delayed Sowing & Pest Alert' },
      { block: 'Kuliana Block', distressLevel: 'MEDIUM', farmersAtRisk: 5, primaryCause: 'Market Price Drop' }
    ]
  };

  return NextResponse.json({ success: true, data });
}
