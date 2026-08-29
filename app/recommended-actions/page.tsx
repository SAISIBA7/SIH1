export const dynamic = 'force-dynamic';
import RecommendedActionsView from "@/components/risk/RecommendedActionsView";

export const metadata = {
  title: "Smart Crop | Recommended Actions & Interventions",
  description: "Prioritized Farm Directives, Agronomic Actions, and Risk Mitigation Plan.",
};

export default function Page() {
  return <RecommendedActionsView />;
}
