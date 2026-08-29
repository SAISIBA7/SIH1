export const dynamic = 'force-dynamic';
import HighRiskFarmersView from "@/components/officer/HighRiskFarmersView";

export const metadata = {
  title: "Smart Crop | High-Risk Farmers Triage Directory",
  description: "Agriculture Officer Real-Time District Distress Queue & Farmer Triage.",
};

export default function Page() {
  return <HighRiskFarmersView />;
}
