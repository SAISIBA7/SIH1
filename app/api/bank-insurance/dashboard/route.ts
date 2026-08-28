import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    overview: {
      totalDisbursedCr: 42.6,
      activeKccAccounts: 8940,
      pmfbyInsuredAreaAcres: 34200,
      portfolioNpaRate: '1.8%',
      pendingApplications: 142
    },
    riskExposure: {
      highRiskDistressAcres: 4800,
      mediumRiskDistressAcres: 11200,
      lowRiskDistressAcres: 18200,
      estimatedClaimExposureCr: 3.4
    },
    recentApplications: [
      { id: 'APP-9021', farmer: 'Ramesh Chandra Mohapatra', type: 'KCC Crop Loan Renewal', amount: '₹75,000', status: 'Approved' },
      { id: 'APP-9022', farmer: 'Basanti Murmu', type: 'PMFBY Crop Insurance Claim', amount: '₹34,000', status: 'Under Review' },
      { id: 'APP-9023', farmer: 'Biren Kumar Sethi', type: 'Drip Irrigation Equipment Loan', amount: '₹1,20,000', status: 'Pending Verification' }
    ]
  };

  return NextResponse.json({ success: true, data });
}
