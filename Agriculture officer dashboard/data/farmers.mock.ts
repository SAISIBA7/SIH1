// Mock data for Agriculture Officer Dashboard
export const riskCounts = {
  high: 17,
  medium: 34,
  low: 128,
  total: 1248,
};

export const mockFarmers = [
  {
    id: "1",
    name: "Ramesh",
    crop: "Paddy",
    riskScore: 81,
    riskTier: "high",
    location: "Mayurbhanj",
    riskReason: "Rainfall ↓35%",
    loanStatus: "Due in 8 days",
  },
  {
    id: "2",
    name: "Suresh",
    crop: "Paddy",
    riskScore: 76,
    riskTier: "high",
    location: "Mayurbhanj",
    riskReason: "Rainfall risk",
    loanStatus: "—",
  },
  {
    id: "3",
    name: "Anita",
    crop: "Maize",
    riskScore: 71,
    riskTier: "high",
    location: "Mayurbhanj",
    riskReason: "Price decline",
    loanStatus: "—",
  },
];

export const mockAlerts = [
  { id: "a1", message: "17 farmers crossed high-risk threshold", type: "risk", timestamp: "2026-08-22T10:00:00Z", read: false },
  { id: "a2", message: "Heavy rainfall expected tomorrow", type: "weather", timestamp: "2026-08-22T08:30:00Z", read: false },
  { id: "a3", message: "Paddy prices decreased in nearby mandis", type: "market", timestamp: "2026-08-22T07:45:00Z", read: false },
];
