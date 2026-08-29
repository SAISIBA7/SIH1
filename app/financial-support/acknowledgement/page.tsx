import { Suspense } from "react";
import AcknowledgementPage from "@/Financial Support/acknowledgement/AcknowledgementPage";

export const metadata = {
  title: "Smart Crop | Loan Application Acknowledgement",
  description: "Official Submission Token, Application Status Tracking & Next Steps.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading acknowledgement...</div>}>
      <AcknowledgementPage />
    </Suspense>
  );
}
