import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    overview: {
      registeredFarmers: 18450,
      activeSchemes: 12,
      subsidiesDisbursedCr: 24.8,
      equipmentHiringCenters: 28,
      equipmentUtilizationPct: 84
    },
    equipmentInventory: [
      { id: 'EQ-01', name: 'Mahindra 575 DI Tractor', category: 'Tractor', totalUnits: 45, availableUnits: 12, dailyRate: '₹900/day' },
      { id: 'EQ-02', name: 'Multi-Crop High Capacity Harvester', category: 'Harvester', totalUnits: 18, availableUnits: 3, dailyRate: '₹2,200/day' },
      { id: 'EQ-03', name: 'Agricultural Spraying Drone (16L)', category: 'Precision Drone', totalUnits: 25, availableUnits: 8, dailyRate: '₹1,100/day' },
      { id: 'EQ-04', name: 'Solar Submersible Water Pump (5HP)', category: 'Solar Pump', totalUnits: 60, availableUnits: 19, dailyRate: '₹450/day' }
    ],
    schemesSummary: [
      { id: 'SCH-01', name: 'PM Krishi Sinchayee Yojana (Micro-Irrigation)', beneficiaries: 4200, fundUtilizedPct: 88 },
      { id: 'SCH-02', name: 'Odisha Millet Mission (Seed & Input Support)', beneficiaries: 6800, fundUtilizedPct: 94 },
      { id: 'SCH-03', name: 'Farm Mechanization Scheme (Subsidized CHC)', beneficiaries: 2150, fundUtilizedPct: 79 }
    ]
  };

  return NextResponse.json({ success: true, data });
}
