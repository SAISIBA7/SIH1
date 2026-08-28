import { Scheme, FarmerProfile } from '../types';

export const mockFarmerProfile: FarmerProfile = {
  name: 'Ramesh Mohanty',
  district: 'Mayurbhanj',
  state: 'Odisha',
  crop: 'Paddy (Rice)',
  landArea: '2.5 Acres',
  category: 'Small & Marginal Farmer',
  distressRiskScore: 81,
};

export const mockSchemes: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Financial Assistance',
    eligibilityPercent: 92,
    benefitSummary: '₹6,000 / year direct bank transfer in 3 equal installments',
    fullDescription:
      'PM-KISAN provides income support to all landholding farmers families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.',
    benefits: [
      '₹2,000 every 4 months directly transferred to Aadhaar-linked bank account',
      '100% centrally sponsored scheme with direct benefit transfer (DBT)',
      'Covers domestic farm expenses, high quality seeds, and fertilizer purchases',
    ],
    eligibilityCriteria: [
      {
        id: 'ec-1',
        label: 'Land Holding Limit',
        matched: true,
        detail: '2.5 acres is within small/marginal farmer limit (up to 5 acres)',
      },
      {
        id: 'ec-2',
        label: 'Primary Crop',
        matched: true,
        detail: 'Paddy farming in Mayurbhanj district is fully eligible',
      },
      {
        id: 'ec-3',
        label: 'State Activation',
        matched: true,
        detail: 'Odisha State DBT portal integration active',
      },
      {
        id: 'ec-4',
        label: 'Bank e-KYC Linkage',
        matched: false,
        detail: 'Aadhaar e-KYC biometric authentication pending verification',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Aadhaar Card (Linked to Mobile)',
        status: 'ready',
        required: true,
        description: 'Used for identity verification and DBT transfers',
      },
      {
        id: 'doc-2',
        name: 'Land Record / Record of Rights (RoR)',
        status: 'ready',
        required: true,
        description: 'Patta/Khata copy in applicant’s name',
      },
      {
        id: 'doc-3',
        name: 'Bank Passbook / Cancelled Cheque',
        status: 'missing',
        required: true,
        description: 'Active savings account copy with IFSC code',
      },
    ],
    applicationStatus: 'not_applied',
    estimatedDays: '7–10 working days',
  },
  {
    id: 'smam-subsidy',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    department: 'Department of Agriculture, Odisha',
    category: 'Equipment Subsidy',
    eligibilityPercent: 88,
    benefitSummary: 'Up to 50% subsidy (max ₹1.5 Lakh) on Power Tillers & Transplanters',
    fullDescription:
      'SMAM aims to increase the reach of farm mechanization to small and marginal farmers and to the regions where availability of farm power is low, offering substantial capital subsidies on modern machinery.',
    benefits: [
      '50% financial subsidy on multi-crop power tillers and paddy transplanters',
      'Priority delivery for small and marginal landholders in Odisha',
      'Free 1-year equipment maintenance and operator training warranty',
    ],
    eligibilityCriteria: [
      {
        id: 'smam-1',
        label: 'Farmer Classification',
        matched: true,
        detail: 'Registered as Small/Marginal Farmer in Odisha Krushak Portal',
      },
      {
        id: 'smam-2',
        label: 'Machinery Suitability',
        matched: true,
        detail: 'Paddy crop terrain in Mayurbhanj is approved for power tiller subsidy',
      },
      {
        id: 'smam-3',
        label: 'Previous Machinery Grants',
        matched: true,
        detail: 'No machinery subsidy claimed in the past 3 years',
      },
    ],
    documents: [
      {
        id: 'smam-doc-1',
        name: 'Krushak Odisha Registration ID',
        status: 'ready',
        required: true,
        description: 'Valid Odisha farmer portal card number',
      },
      {
        id: 'smam-doc-2',
        name: 'Land Possession Certificate (LPC)',
        status: 'ready',
        required: true,
        description: 'Certified by Revenue Inspector',
      },
      {
        id: 'smam-doc-3',
        name: 'Quotation from Authorized Dealer',
        status: 'missing',
        required: false,
        description: 'Dealer proforma invoice for chosen equipment',
      },
    ],
    applicationStatus: 'not_applied',
    estimatedDays: '15 working days',
  },
  {
    id: 'kalia-scheme',
    name: 'KALIA (Krushak Assistance for Livelihood and Income Augmentation)',
    department: 'Government of Odisha',
    category: 'Crop Support',
    eligibilityPercent: 95,
    benefitSummary: '₹10,000 / year (₹5,000 per Kharif & Rabi season) for farming inputs',
    fullDescription:
      'KALIA is an all-inclusive farmer welfare scheme by the Odisha government designed to accelerate agricultural prosperity and eliminate poverty by assisting small farmers, marginal cultivators, and landless agricultural laborers.',
    benefits: [
      '₹5,000 Kharif and ₹5,000 Rabi direct seasonal grant for seeds & fertilizers',
      'Life insurance cover of ₹2.00 lakh at nominal premium of ₹330',
      'Crop loans up to ₹50,000 provided at 0% interest rate',
    ],
    eligibilityCriteria: [
      {
        id: 'kalia-1',
        label: 'Resident of Odisha',
        matched: true,
        detail: 'Mayurbhanj district resident verified by Ration Card',
      },
      {
        id: 'kalia-2',
        label: 'Distress Score Flag',
        matched: true,
        detail: 'High rainfall deficit risk triggers automatic priority processing',
      },
      {
        id: 'kalia-3',
        label: 'Land Size',
        matched: true,
        detail: '2.5 acres falls cleanly under small cultivator category',
      },
    ],
    documents: [
      {
        id: 'kalia-doc-1',
        name: 'Aadhaar Card',
        status: 'ready',
        required: true,
      },
      {
        id: 'kalia-doc-2',
        name: 'Ration Card (NFSA / SFSA)',
        status: 'ready',
        required: true,
      },
      {
        id: 'kalia-doc-3',
        name: 'Bank Passbook linked with Aadhaar',
        status: 'ready',
        required: true,
      },
    ],
    applicationStatus: 'submitted',
    submittedDate: '12 Aug 2026',
    applicationStage: 'verification',
    estimatedDays: '7–10 working days',
  },
  {
    id: 'pmksy-irrigation',
    name: 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana) - Per Drop More Crop',
    department: 'Ministry of Jal Shakti / Odisha Water Resources',
    category: 'Irrigation Support',
    eligibilityPercent: 78,
    benefitSummary: '55% subsidy on Micro-Irrigation Drip & Sprinkler Systems',
    fullDescription:
      'PMKSY is formulated with the vision of extending the coverage of irrigation ‘Har Khet Ko Pani’ and improving water use efficiency ‘More crop per drop’ in a focused manner with end-to-end solutions on source creation and distribution.',
    benefits: [
      '55% grant for installation of portable sprinkler systems',
      'Reduces water requirement by 40% while raising crop yield by up to 25%',
      'Solar pump integration subsidy options available',
    ],
    eligibilityCriteria: [
      {
        id: 'pmksy-1',
        label: 'Water Source Availability',
        matched: true,
        detail: 'Borewell / open well connectivity certified in village circle',
      },
      {
        id: 'pmksy-2',
        label: 'Cultivable Area',
        matched: true,
        detail: 'Minimum 1 acre required; Ramesh has 2.5 acres',
      },
      {
        id: 'pmksy-3',
        label: 'Soil & Water Testing Report',
        matched: false,
        detail: 'Soil health card available, water salinity test pending',
      },
    ],
    documents: [
      {
        id: 'pmksy-doc-1',
        name: 'Land Record (RoR)',
        status: 'ready',
        required: true,
      },
      {
        id: 'pmksy-doc-2',
        name: 'Electricity / Borewell NOC',
        status: 'missing',
        required: true,
      },
      {
        id: 'pmksy-doc-3',
        name: 'Aadhaar Card',
        status: 'ready',
        required: true,
      },
    ],
    applicationStatus: 'not_applied',
    estimatedDays: '20 working days',
  },
  {
    id: 'pmfby-insurance',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    department: 'Ministry of Agriculture / Odisha Ag Insurance Co.',
    category: 'Insurance Support',
    eligibilityPercent: 91,
    benefitSummary: 'Full crop insurance coverage for Paddy with only 2% farmer premium',
    fullDescription:
      'PMFBY provides a comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers and encouraging them to adopt innovative practices. Covers drought, unseasonal floods, and pest attacks.',
    benefits: [
      'Direct payout up to ₹28,000 per acre in case of localized calamity or drought',
      'Only 2.0% nominal premium payable by farmer (balance 98% borne by Gov)',
      'Satellite and drone based crop-cutting damage estimation',
    ],
    eligibilityCriteria: [
      {
        id: 'pmfby-1',
        label: 'Notified Area Crop',
        matched: true,
        detail: 'Paddy in Mayurbhanj is an officially notified Kharif crop',
      },
      {
        id: 'pmfby-2',
        label: 'Sowing Window',
        matched: true,
        detail: 'Kharif season registration currently active',
      },
      {
        id: 'pmfby-3',
        label: 'Sowing Certificate',
        matched: true,
        detail: 'Sowing declaration verified by local VAW (Village Agriculture Worker)',
      },
    ],
    documents: [
      {
        id: 'pmfby-doc-1',
        name: 'Sowing Certificate / Declaration',
        status: 'ready',
        required: true,
      },
      {
        id: 'pmfby-doc-2',
        name: 'Land Record RoR',
        status: 'ready',
        required: true,
      },
      {
        id: 'pmfby-doc-3',
        name: 'Bank Account Linked to Aadhaar',
        status: 'ready',
        required: true,
      },
    ],
    applicationStatus: 'approved',
    submittedDate: '01 Jul 2026',
    applicationStage: 'approved',
    estimatedDays: 'Approved & Active',
  },
  {
    id: 'biju-krushak-kalyan',
    name: 'Biju Krushak Kalyan Yojana (BKKY)',
    department: 'Department of Agriculture & Farmers’ Empowerment, Odisha',
    category: 'Farmer Welfare',
    eligibilityPercent: 85,
    benefitSummary: 'Health & Accidental Insurance coverage up to ₹1,00,000 for farmer family',
    fullDescription:
      'BKKY provides financial support to farm families in Odisha to meet health and accidental emergencies, ensuring healthcare expenses do not push farming households into debt.',
    benefits: [
      'Cashless hospitalization up to ₹1 Lakh across empanelled government and private hospitals',
      'Covers up to 5 family members including spouse and dependent children',
      'No premium burden on farmer family',
    ],
    eligibilityCriteria: [
      {
        id: 'bkky-1',
        label: 'Odisha Resident & Cultivator',
        matched: true,
        detail: 'Verified farmer family in Mayurbhanj district',
      },
      {
        id: 'bkky-2',
        label: 'Family Income Category',
        matched: true,
        detail: 'Small farmer household qualifies automatically',
      },
    ],
    documents: [
      {
        id: 'bkky-doc-1',
        name: 'Farmer ID / Krushak Odisha Card',
        status: 'ready',
        required: true,
      },
      {
        id: 'bkky-doc-2',
        name: 'Family Aadhaar Numbers',
        status: 'ready',
        required: true,
      },
    ],
    applicationStatus: 'not_applied',
    estimatedDays: '5 working days',
  },
];
