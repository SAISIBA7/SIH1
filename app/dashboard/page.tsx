export const dynamic = 'force-dynamic';
import FarmerDashboard from "@/farmer deshboard/deshboard";

export const metadata = {
  title: "Smart Crop | Farmer Dashboard",
  description: "AI-Powered Farm Intelligence, Crop Advisory, Mandi Prices and Financial Support.",
};

export default function DashboardPage() {
  return <FarmerDashboard />;
}
