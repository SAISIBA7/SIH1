export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import AddFacilityPage from "@/Bank Portal/facilities/AddFacilityPage";

export const metadata = {
  title: "Smart Crop | Add Financial Facility",
  description: "Create New Agricultural Credit Scheme or Loan Product.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AddFacilityPage />
    </Suspense>
  );
}
