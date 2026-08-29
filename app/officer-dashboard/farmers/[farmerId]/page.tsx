export const dynamic = 'force-dynamic';
import FarmerDetailView from "@/components/officer/FarmerDetailView";

export const metadata = {
  title: "Smart Crop | Officer Farmer Distress Dossier",
  description: "Agriculture Officer Diagnostic Dossier, Soil Metrics, & Intervention Dispatch.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ farmerId: string }>;
}) {
  const { farmerId } = await params;
  return <FarmerDetailView farmerId={farmerId} />;
}
