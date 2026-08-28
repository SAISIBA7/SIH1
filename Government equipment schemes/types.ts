export type SchemeCategory =
  | 'All'
  | 'Crop Support'
  | 'Equipment Subsidy'
  | 'Irrigation Support'
  | 'Insurance Support'
  | 'Financial Assistance'
  | 'Farmer Welfare';

export type ApplicationStatus =
  | 'not_applied'
  | 'submitted'
  | 'verification'
  | 'approved'
  | 'rejected';

export interface EligibilityCriterion {
  id: string;
  label: string;
  matched: boolean;
  detail: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  status: 'ready' | 'missing';
  required: boolean;
  description?: string;
}

export interface FarmerProfile {
  name: string;
  district: string;
  state: string;
  crop: string;
  landArea: string;
  category: string;
  distressRiskScore: number;
}

export interface Scheme {
  id: string;
  name: string;
  department: string;
  category: SchemeCategory;
  eligibilityPercent: number;
  benefitSummary: string;
  fullDescription: string;
  benefits: string[];
  eligibilityCriteria: EligibilityCriterion[];
  documents: DocumentItem[];
  applicationStatus?: ApplicationStatus;
  submittedDate?: string;
  estimatedDays?: string;
  applicationStage?: 'submitted' | 'verification' | 'approved' | 'rejected';
  rejectionReason?: string;
}
