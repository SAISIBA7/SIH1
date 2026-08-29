export const dynamic = 'force-dynamic';

import InsurancePage from "@/insurance/insurance";

export const metadata = {
  title: "Smart Crop Insurance Portal | PMFBY",
  description: "Protect your paddy crop when distress strikes. Subsidized government crop insurance under PMFBY.",
};

export default function InsuranceRoute() {
  return <InsurancePage />;
}
