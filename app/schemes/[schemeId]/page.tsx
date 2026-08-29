export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";

export const metadata = {
  title: "Smart Crop | Scheme Application & Subsidy Roadmap",
  description: "Government Scheme Milestone Timeline, Document Checklist & Direct Application.",
};

// Scheme details are managed by the SchemeHub store on /schemes.
// Deep-linking to a specific scheme ID redirects to the hub.
export default function Page({ params }: { params: { schemeId: string } }) {
  redirect("/schemes");
}
