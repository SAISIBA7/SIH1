export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import FullCropGuidePage from "@/Full crop guide/Full crop guide";

export const metadata = {
  title: "Smart Crop | Full Cultivation Agronomy Guide",
  description: "End-to-End Farming Manual, Pest Management & Post-Harvest Storage Guide.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Guide...</div>}>
      <FullCropGuidePage />
    </Suspense>
  );
}
