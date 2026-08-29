export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import AcknowledgementPage from "@/Financial Support/acknowledgement/AcknowledgementPage";

export const metadata = {
  title: "Smart Crop | Loan Application Acknowledgement",
  description: "Official Submission Token, Application Status Tracking & Next Steps.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Acknowledgement...</div>}>
      <AcknowledgementPage />
    </Suspense>
  );
}
