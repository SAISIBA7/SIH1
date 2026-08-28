import { NextResponse } from 'next/server';

export async function GET() {
  const recommendations = [
    {
      id: 'REC-01',
      title: 'Initiate Evening Micro-Irrigation',
      category: 'Agronomic Intervention',
      priority: 'HIGH',
      impact: 'Reduces moisture distress by ~35%',
      timeframe: 'Immediate (Within 12 Hours)',
      description: 'Run pump during 6 PM - 9 PM window to prevent evapotranspiration loss and replenish panicle root moisture.',
      actionUrl: '/crop-monitoring',
      isCompleted: false
    },
    {
      id: 'REC-02',
      title: 'Apply 2% Potassium Nitrate (13-0-45) Foliar Spray',
      category: 'Nutrient Management',
      priority: 'HIGH',
      impact: 'Strengthens osmotic adjustment & prevents flower drop',
      timeframe: 'Within 48 Hours',
      description: 'Spray 20g per liter of water in clear morning weather. Avoid tank-mixing with organophosphates.',
      actionUrl: '/crop-details',
      isCompleted: false
    },
    {
      id: 'REC-03',
      title: 'Explore Short-Duration Alternative Crop for Parcel C',
      category: 'Risk Diversification',
      priority: 'MEDIUM',
      impact: 'Protects post-monsoon farm revenue',
      timeframe: 'Next 7 Days',
      description: 'Consider Finger Millet (Ragi GPU-28) or Black Gram under Odisha Millet Mission with guaranteed MSP procurement.',
      actionUrl: '/alternative-crop',
      isCompleted: false
    },
    {
      id: 'REC-04',
      title: 'Verify PMFBY Crop Insurance & Localized Loss Clause',
      category: 'Financial Protection',
      priority: 'MEDIUM',
      impact: 'Ensures 100% claim eligibility if dry spell exceeds 15 days',
      timeframe: 'Next 3 Days',
      description: 'Confirm policy number linkage with your Aadhaar and land record (RoR) in the Insurance Portal.',
      actionUrl: '/insurance',
      isCompleted: false
    },
    {
      id: 'REC-05',
      title: 'Request Agriculture Officer Field Inspection',
      category: 'Extension Support',
      priority: 'LOW',
      impact: 'Formalizes block-level assistance & subsidy advisory',
      timeframe: 'Flexible',
      description: 'Notify Agriculture Officer Satyajit Jena for parcel verification and soil amendment kit distribution.',
      actionUrl: '/officer-dashboard',
      isCompleted: false
    }
  ];

  return NextResponse.json({ success: true, data: recommendations });
}
