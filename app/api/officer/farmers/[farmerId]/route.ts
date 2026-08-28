import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ farmerId: string }> }
) {
  const { farmerId } = await params;

  const farmerDetail = {
    id: farmerId,
    name: farmerId === 'FRM-6190' ? 'Basanti Murmu' : 'Ramesh Chandra Mohapatra',
    phone: '+91 98612 34567',
    aadhaar: 'XXXX-XXXX-4912',
    village: 'Baripada',
    block: 'Baripada Block',
    district: 'Mayurbhanj, Odisha',
    landArea: '3.8 Acres',
    soilType: 'Red Loamy (pH 6.4)',
    irrigationSource: 'Borewell & Canal Tributary',
    crop: {
      name: 'Paddy (Swarna MTU 7029)',
      sowingDate: '2026-06-15',
      currentStage: 'Panicle Initiation (Day 54)',
      healthScore: 68,
      ndviScore: 0.61
    },
    riskProfile: {
      overallScore: 84,
      level: 'HIGH',
      weatherRisk: 72,
      soilMoistureRisk: 68,
      marketRisk: 54,
      creditRisk: 35,
      distressReason: 'Compounding 14-day dry spell with rising soil temperature. Yield risk estimated at 18-22% if unaddressed.'
    },
    financialStatus: {
      kccLoan: '₹65,000 (State Bank of India - Baripada)',
      dueDate: '2026-11-30',
      pmfbyStatus: 'Active & Verified',
      subsidyAvailed: 'Solar Water Pump Scheme (2024)'
    },
    interventionsHistory: [
      { date: '2026-08-20', type: 'Advisory SMS', note: 'Sent dry-spell preventive management guideline.' },
      { date: '2026-08-12', type: 'Voice Alert', note: 'Notified on subsidized micro-irrigation equipment CHC availability.' }
    ]
  };

  return NextResponse.json({ success: true, data: farmerDetail });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ farmerId: string }> }
) {
  const { farmerId } = await params;
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    success: true,
    message: `Intervention recorded successfully for farmer ${farmerId}`,
    intervention: {
      id: `INT-${Date.now().toString().slice(-4)}`,
      farmerId,
      type: body.type || 'FIELD_VISIT',
      notes: body.notes || 'Scheduled urgent on-site soil and moisture verification.',
      scheduledDate: body.date || new Date().toISOString(),
      officer: 'Satyajit Jena (Block Agriculture Officer)'
    }
  });
}
