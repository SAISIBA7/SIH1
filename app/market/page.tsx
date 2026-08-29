export const dynamic = 'force-dynamic';
import MarketPage from "@/marketpage/marketpage";

export const metadata = {
  title: "Smart Crop | APMC Mandi Price Intelligence & Net Realization",
  description: "Live Wholesale Mandi Prices, MSP Comparison, Transport Calculator, and Market Trends.",
};

export default function Page() {
  return <MarketPage />;
}
