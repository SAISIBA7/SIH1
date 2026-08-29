export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import FacilityDetailPage from "@/Financial Support/detail/FacilityDetailPage";

export const metadata = {
  title: "Smart Crop | Credit Facility Terms & Application",
  description: "Comprehensive Loan Terms, Subvention Schedule, and Instant Application.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Facility Details...</div>}>
      <FacilityDetailPage />
    </Suspense>
  );
}
