import EquipmentDetailView from "@/components/equipment/EquipmentDetailView";

export const metadata = {
  title: "Smart Crop | Equipment Details & CHC Rental",
  description: "Custom Hiring Center (CHC) Agricultural Machinery Rental & Booking.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ equipmentId: string }>;
}) {
  const { equipmentId } = await params;
  return <EquipmentDetailView equipmentId={equipmentId} />;
}
