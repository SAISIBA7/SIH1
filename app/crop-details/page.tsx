export const dynamic = 'force-dynamic';
import CropDetailsPage from "@/Crop Details/Crop Details";

export const metadata = {
  title: "Smart Crop | Crop Details & Sowing Guide",
  description: "Detailed Agronomic Parameters, Stage Lifecycle, and Cultivation Protocols.",
};

export default function Page() {
  return <CropDetailsPage />;
}
