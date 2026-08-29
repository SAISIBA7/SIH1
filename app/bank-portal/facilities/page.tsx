import { Suspense } from "react";
import ManageFacilitiesPage from "@/Bank Portal/facilities/ManageFacilitiesPage";

export const metadata = {
  title: "Smart Crop | Manage Financial Facilities",
  description: "Bank Partner Credit Products, Allocation Limits, and Terms Management.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading facilities...</div>}>
      <ManageFacilitiesPage />
    </Suspense>
  );
}
