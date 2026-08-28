// Types for Agriculture Officer Dashboard

export type RiskTier = 'high' | 'medium' | 'low';
export type AlertType = 'risk' | 'weather' | 'market' | 'system';
export type InterventionType = 'field' | 'insurance' | 'crop';

export interface Farmer {
  id: string;
  name: string;
  crop: string;
  riskScore: number;
  riskTier: RiskTier;
  location: string;
  riskReason: string;
  loanStatus: string;
}

export interface RiskCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface DashboardAlert {
  id: string;
  message: string;
  type: AlertType;
  timestamp: string;
  read: boolean;
}
