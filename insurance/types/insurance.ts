export type InsuranceState =
  | "NOT_REGISTERED"
  | "ELIGIBLE"
  | "APPLICATION_PENDING"
  | "ACTIVE"
  | "ACTION_REQUIRED";

export interface FarmerProfile {
  name: string;
  fatherName: string;
  district: string;
  state: string;
  village: string;
  mobile: string;
  crop: string;
  area: string;
  season: string;
  aadhaarLinked: boolean;
  kccHolder: boolean;
  sumInsured: string;
  farmerPremium: string;
  govSubsidy: string;
}

export interface RiskFactor {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface RiskProfile {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH";
  factors: RiskFactor[];
}

export type DocStatus = "Uploaded" | "Pending" | "Verified" | "Rejected";

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: DocStatus;
  mandatory: boolean;
  updatedAt?: string;
}

export interface ApplicationInfo {
  applicationId: string;
  submittedAt: string;
  stage: "SUBMITTED" | "DOCS_RECEIVED" | "UNDER_REVIEW" | "APPROVED" | "POLICY_ACTIVE";
  policyNumber?: string;
}

export interface BankScheme {
  id: string;
  bankId: string;
  bankName: string;
  schemeName: string;
  description?: string;
  cropsCovered: string[];
  eligibleLocations?: string[];
  eligibleSeasons?: string[];
  eligibilitySummary: string[];
  coverageAmount?: string;
  premium?: string;
  subsidy?: string;
  policyPeriod?: string;
  requiredDocuments: string[];
  availabilityStatus: "available" | "unavailable" | "unknown";
}
