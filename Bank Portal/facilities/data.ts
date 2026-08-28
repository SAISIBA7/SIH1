export type FacilityStatus = 'Published' | 'Draft' | 'Under Review';

export interface Facility {
  id: string;
  bankId: string;
  bankName: string;
  bankVerified: boolean;
  facilityName: string;
  facilityType: string;
  shortDescription: string;
  detailedDescription: string;
  minAmount: string;
  maxAmount: string;
  interestRate: string;
  tenure: string;
  repayment: string;
  processingFee: string;
  otherCharges: string;
  farmerType: string[];
  minLand: string;
  cropTypes: string[];
  states: string[];
  districts: string[];
  otherEligibility: string;
  documents: string[];
  benefits: string[];
  termsText: string;
  termsUrl: string;
  applicationUrl: string;
  status: FacilityStatus;
  lastUpdated: string;
  expiryDate?: string;
}

export const DISCLAIMER =
  'Disclaimer: Smart Crop provides financial facility information for discovery purposes only. Smart Crop does not provide, approve, process, guarantee, or disburse loans. Final eligibility, interest rate, documentation requirements, approval, repayment conditions and other terms are determined solely by the respective bank or financial institution.';

export const mockFacilities: Facility[] = [
  {
    id: 'f1',
    bankId: 'b1',
    bankName: 'ABC Rural Bank',
    bankVerified: true,
    facilityName: 'Crop Loan',
    facilityType: 'Crop Loan',
    shortDescription: 'For eligible farmers requiring agricultural working capital.',
    detailedDescription: 'ABC Rural Bank Crop Loan provides short-term credit to farmers for meeting input costs like seeds, fertilisers, pesticides, labour and other working capital requirements of crop cultivation.',
    minAmount: 'Rs.50,000',
    maxAmount: 'Rs.10,00,000',
    interestRate: 'Starting from 7%',
    tenure: '6 months - 5 years',
    repayment: 'Seasonal / As specified by bank',
    processingFee: 'As per bank policy',
    otherCharges: 'Documentation and insurance charges may apply',
    farmerType: ['Individual Farmer', 'Tenant Farmer', 'Sharecropper'],
    minLand: '1 acre',
    cropTypes: ['Paddy', 'Wheat', 'Maize', 'Pulses'],
    states: ['Odisha'],
    districts: ['Mayurbhanj', 'Balasore', 'Cuttack', 'Bhubaneswar'],
    otherEligibility: 'Valid land record required. Other bank conditions apply.',
    documents: ['Aadhaar', 'PAN', 'Land ownership document', 'Bank account details', 'Passport-size photograph', 'Crop details'],
    benefits: ['Agricultural-purpose financing', 'Flexible repayment options', 'Seasonal repayment facility', 'Available in selected districts'],
    termsText: 'This facility is subject to bank credit appraisal. Interest rates are subject to change. Repayment schedule will be defined at time of disbursement. Penal interest may apply on late payment. The bank reserves the right to modify terms without prior notice.',
    termsUrl: 'https://example-abc-rural-bank.com/terms',
    applicationUrl: 'https://example-abc-rural-bank.com/apply/crop-loan',
    status: 'Published',
    lastUpdated: '20 Aug 2026',
  },
  {
    id: 'f2',
    bankId: 'b1',
    bankName: 'ABC Rural Bank',
    bankVerified: true,
    facilityName: 'Equipment Finance',
    facilityType: 'Farm Equipment Loan',
    shortDescription: 'Finance for agricultural equipment purchase.',
    detailedDescription: 'ABC Rural Bank Equipment Finance offers loans for purchase of tractors, harvesters, irrigation pumps and other farm machinery to improve farm productivity.',
    minAmount: 'Rs.1,00,000',
    maxAmount: 'Rs.30,00,000',
    interestRate: '8% - 11%',
    tenure: '1 - 7 years',
    repayment: 'Monthly / Quarterly',
    processingFee: '1% of loan amount',
    otherCharges: 'Insurance of equipment is mandatory',
    farmerType: ['Individual Farmer', 'Farmer Producer Organization'],
    minLand: '2 acres',
    cropTypes: ['Paddy', 'Wheat', 'Oilseeds', 'Vegetables'],
    states: ['Odisha'],
    districts: ['Mayurbhanj', 'Keonjhar', 'Sundargarh'],
    otherEligibility: 'Equipment must be new and from approved dealers.',
    documents: ['Aadhaar', 'PAN', 'Land records', 'Bank account details', 'Equipment quotation', 'Dealer certificate'],
    benefits: ['Equipment purchase support', 'Long tenure up to 7 years', 'Flexible EMI options', 'Covers tractors, pumps and harvesters'],
    termsText: 'Hypothecation of equipment to the bank until full repayment. Insurance must be maintained at all times. Prepayment charges may apply. Subject to credit appraisal.',
    termsUrl: 'https://example-abc-rural-bank.com/terms/equipment',
    applicationUrl: 'https://example-abc-rural-bank.com/apply/equipment-finance',
    status: 'Published',
    lastUpdated: '18 Aug 2026',
  },
  {
    id: 'f3',
    bankId: 'b2',
    bankName: 'XYZ Small Finance Bank',
    bankVerified: true,
    facilityName: 'Kisan Credit Facility',
    facilityType: 'Kisan Credit Facility',
    shortDescription: 'Revolving credit for farmers to meet seasonal needs.',
    detailedDescription: 'XYZ Small Finance Bank Kisan Credit Facility provides a revolving line of credit to farmers to meet their crop cultivation, post-harvest, and allied activities expenses throughout the year.',
    minAmount: 'Rs.25,000',
    maxAmount: 'Rs.5,00,000',
    interestRate: '7.5% - 9%',
    tenure: '1 - 5 years',
    repayment: 'Half-yearly / Seasonal',
    processingFee: 'Nil for loans up to Rs.1.6L (as per government policy)',
    otherCharges: 'Stamp duty and other statutory charges as applicable',
    farmerType: ['Individual Farmer', 'Tenant Farmer', 'Sharecropper'],
    minLand: '0.5 acres',
    cropTypes: ['Paddy', 'Maize', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits'],
    states: ['Odisha', 'Jharkhand'],
    districts: ['Mayurbhanj', 'Balasore', 'Bhadrak', 'Dumka'],
    otherEligibility: 'Kisan Credit Card will be issued. Annual renewal required.',
    documents: ['Aadhaar', 'Land records', 'Bank account details', 'Crop information', 'Address proof'],
    benefits: ['Revolving credit facility', 'Covers post-harvest expenses', 'Linked to Kisan Credit Card', 'Government interest subvention available'],
    termsText: 'Annual review and renewal of credit limit is mandatory. Interest subvention as per government scheme guidelines. Credit limit may be enhanced based on track record. Subject to bank terms and conditions.',
    termsUrl: 'https://example-xyz-sfb.com/terms/kisan-credit',
    applicationUrl: 'https://example-xyz-sfb.com/apply/kisan-credit',
    status: 'Published',
    lastUpdated: '15 Aug 2026',
  },
  {
    id: 'f4',
    bankId: 'b2',
    bankName: 'XYZ Small Finance Bank',
    bankVerified: true,
    facilityName: 'Irrigation Finance',
    facilityType: 'Irrigation Loan',
    shortDescription: 'Loans for irrigation infrastructure to improve water availability.',
    detailedDescription: 'XYZ Small Finance Bank Irrigation Finance supports farmers in creating or improving irrigation infrastructure including borewells, drip irrigation, sprinkler systems and farm ponds.',
    minAmount: 'Rs.50,000',
    maxAmount: 'Rs.15,00,000',
    interestRate: 'Starting from 9%',
    tenure: '5 - 10 years',
    repayment: 'Half-yearly / Quarterly',
    processingFee: 'As per bank policy',
    otherCharges: 'Subsidy benefit may be applicable under government schemes',
    farmerType: ['Individual Farmer', 'Farmer Producer Organization'],
    minLand: '1 acre',
    cropTypes: ['Paddy', 'Vegetables', 'Fruits', 'Horticulture'],
    states: ['Odisha'],
    districts: ['Puri', 'Ganjam', 'Koraput', 'Rayagada'],
    otherEligibility: 'Land must have clear title. Subsidy eligible if under PMKSY.',
    documents: ['Aadhaar', 'Land records', 'Bank account details', 'Project report / Quotation', 'Photograph'],
    benefits: ['Improves water availability for crops', 'Long repayment period', 'Government subsidy linkage possible', 'Covers drip and sprinkler systems'],
    termsText: 'Subsidy amount will be credited directly to loan account if applicable. Asset to be hypothecated. Regular inspection by bank officials may be conducted. Terms subject to change as per bank policy.',
    termsUrl: 'https://example-xyz-sfb.com/terms/irrigation',
    applicationUrl: 'https://example-xyz-sfb.com/apply/irrigation-finance',
    status: 'Published',
    lastUpdated: '12 Aug 2026',
  },
  {
    id: 'f5',
    bankId: 'b3',
    bankName: 'Odisha Cooperative Bank',
    bankVerified: false,
    facilityName: 'Agricultural Development Loan',
    facilityType: 'Agricultural Infrastructure Loan',
    shortDescription: 'Long-term finance for agricultural development activities.',
    detailedDescription: 'Odisha Cooperative Bank provides long-term agricultural development loans for activities like land development, minor irrigation, plantation, horticulture and other agricultural investments.',
    minAmount: 'Rs.1,00,000',
    maxAmount: 'Rs.20,00,000',
    interestRate: '10% - 13%',
    tenure: '5 - 15 years',
    repayment: 'Half-yearly',
    processingFee: '0.5% of loan amount',
    otherCharges: 'Legal and documentation charges as applicable',
    farmerType: ['Individual Farmer', 'Agricultural Business'],
    minLand: '2 acres',
    cropTypes: ['Fruits', 'Horticulture', 'Other'],
    states: ['Odisha'],
    districts: ['Bhubaneswar', 'Cuttack', 'Khordha'],
    otherEligibility: 'Viable project plan required. Soil and land assessment by bank.',
    documents: ['Aadhaar', 'PAN', 'Land ownership document', 'Project report', 'Bank account details', 'Photograph'],
    benefits: ['Long-term investment support', 'Covers plantation and horticulture', 'Land development financing', 'Flexible repayment'],
    termsText: 'Project must be completed within stipulated time. Regular progress reports required. Subject to periodic bank inspection. Terms and interest rates subject to revision.',
    termsUrl: 'https://example-ocb.in/terms/agri-dev',
    applicationUrl: 'https://example-ocb.in/apply/agri-development',
    status: 'Draft',
    lastUpdated: '10 Aug 2026',
  },
];

export const mockBanks = [
  {
    id: 'b1',
    name: 'ABC Rural Bank',
    type: 'Regional Rural Bank',
    website: 'https://example-abc-rural-bank.com',
    email: 'contact@example-abc-rural-bank.com',
    phone: '+91-98765-43210',
    hq: '12, Agri Tower, Bhubaneswar',
    state: 'Odisha',
    district: 'Khordha',
    country: 'India',
    description: 'ABC Rural Bank provides financial services for farmers and rural businesses in Odisha.',
    verified: true,
    facilitiesCount: { total: 3, published: 2, draft: 0, underReview: 1 },
  },
  {
    id: 'b2',
    name: 'XYZ Small Finance Bank',
    type: 'Small Finance Bank',
    website: 'https://example-xyz-sfb.com',
    email: 'info@example-xyz-sfb.com',
    phone: '+91-87654-32109',
    hq: '5, Finance Nagar, Ranchi',
    state: 'Jharkhand',
    district: 'Ranchi',
    country: 'India',
    description: 'XYZ Small Finance Bank serves small and marginal farmers with affordable credit products.',
    verified: true,
    facilitiesCount: { total: 4, published: 4, draft: 0, underReview: 0 },
  },
];
