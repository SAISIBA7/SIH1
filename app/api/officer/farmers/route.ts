import { NextRequest, NextResponse } from 'next/server';

const MOCK_OFFICER_FARMERS = [
  {
    id: 'FRM-7821',
    name: 'Ramesh Chandra Mohapatra',
    phone: '+91 98612 34567',
    village: 'Baripada, Mayurbhanj',
    crop: 'Paddy (Swarna)',
    landArea: '3.8 Acres',
    riskScore: 84,
    riskLevel: 'HIGH',
    riskFactors: ['Dry Spell (-22%)', 'Soil Moisture 24%', 'Mandi Influx'],
    insuranceStatus: 'Enrolled (PMFBY)',
    loanStatus: 'KCC Active (₹65,000)',
    lastContact: '3 days ago',
    interventionStatus: 'Scheduled'
  },
  {
    id: 'FRM-6190',
    name: 'Basanti Murmu',
    phone: '+91 94371 88290',
    village: 'Betnoti, Mayurbhanj',
    crop: 'Groundnut (TMV-2)',
    landArea: '2.5 Acres',
    riskScore: 79,
    riskLevel: 'HIGH',
    riskFactors: ['Tikka Disease Vector', 'Soil Moisture Depletion'],
    insuranceStatus: 'Pending Renewal',
    loanStatus: 'No Loan',
    lastContact: '1 week ago',
    interventionStatus: 'Action Required'
  },
  {
    id: 'FRM-5034',
    name: 'Biren Kumar Sethi',
    phone: '+91 70081 22910',
    village: 'Badasahi, Mayurbhanj',
    crop: 'Paddy (Pooja)',
    landArea: '4.2 Acres',
    riskScore: 73,
    riskLevel: 'HIGH',
    riskFactors: ['Canal Water Stoppage', 'Market Price Drop'],
    insuranceStatus: 'Enrolled (PMFBY)',
    loanStatus: 'KCC Active (₹80,000)',
    lastContact: 'Yesterday',
    interventionStatus: 'In Progress'
  },
  {
    id: 'FRM-4112',
    name: 'Satyabhama Mahanta',
    phone: '+91 97772 44102',
    village: 'Kuliana, Mayurbhanj',
    crop: 'Mustard (PT-303)',
    landArea: '1.9 Acres',
    riskScore: 56,
    riskLevel: 'MEDIUM',
    riskFactors: ['Aphid Infestation', 'Fertilizer Delay'],
    insuranceStatus: 'Enrolled',
    loanStatus: 'SHG Micro-Loan',
    lastContact: '5 days ago',
    interventionStatus: 'Resolved'
  },
  {
    id: 'FRM-3980',
    name: 'Dibakar Hansdah',
    phone: '+91 91240 55678',
    village: 'Rairangpur, Mayurbhanj',
    crop: 'Maize (HQPM-1)',
    landArea: '3.0 Acres',
    riskScore: 28,
    riskLevel: 'LOW',
    riskFactors: ['Optimal Growth Conditions'],
    insuranceStatus: 'Enrolled',
    loanStatus: 'KCC Standard',
    lastContact: '2 weeks ago',
    interventionStatus: 'None'
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const riskFilter = searchParams.get('risk');

  let results = MOCK_OFFICER_FARMERS;
  if (riskFilter === 'high') {
    results = results.filter(f => f.riskLevel === 'HIGH');
  } else if (riskFilter === 'medium') {
    results = results.filter(f => f.riskLevel === 'MEDIUM');
  }

  return NextResponse.json({ success: true, count: results.length, data: results });
}
