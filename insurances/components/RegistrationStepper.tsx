"use client";

import React, { useState } from "react";
import { FarmerProfile, DocumentItem, ApplicationInfo } from "../types/insurance";

interface RegistrationStepperProps {
  farmer: FarmerProfile;
  documents: DocumentItem[];
  application: ApplicationInfo;
  onComplete: () => void;
  onCancel: () => void;
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  farmer,
  documents,
  application,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onComplete();
    }, 800);
  };

  return (
    <section className="w-full rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 sm:p-7 shadow-md text-gray-900 relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
            {isSubmitted ? "APPLICATION STATUS" : "REGISTRATION SUMMARY & SUBMISSION"}
          </span>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          {isSubmitted ? "Close / Back to Overview" : "Cancel"}
        </button>
      </div>

      {isSubmitted ? (
        /* Success Screen & Status Timeline per PRD §9 & §11 */
        <div className="py-4 space-y-6">
          {/* Success Banner */}
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                  REGISTRATION SUBMITTED
                </div>
                <div className="text-base font-extrabold text-gray-900 mt-0.5">
                  Application ID: <span className="font-mono text-emerald-900">{application.applicationId}</span>
                </div>
                <div className="text-xs text-emerald-800 mt-0.5">
                  Status: <span className="font-bold text-amber-800">🟡 UNDER REVIEW</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 sm:text-right">
              Submitted on {application.submittedAt}
            </div>
          </div>

          {/* Application Status Timeline per PRD §11 */}
          <div className="p-5 rounded-xl bg-gray-50/90 border border-gray-200/90 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-200">
              APPLICATION TIMELINE
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-emerald-700 font-bold text-sm">✓</span>
                <div>
                  <strong className="text-gray-900">Registration submitted</strong>
                  <span className="text-gray-500 ml-2">— 12 Aug 2026</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-700 font-bold text-sm">✓</span>
                <div>
                  <strong className="text-gray-900">Documents received</strong>
                  <span className="text-gray-500 ml-2">— 12 Aug 2026</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-600 font-bold text-sm animate-pulse">●</span>
                <div>
                  <strong className="text-amber-900">Application under review</strong>
                  <span className="text-amber-700 ml-2">— current stage</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-400">
                <span>○</span>
                <div>
                  <strong>Approval</strong>
                  <span className="ml-2">— pending</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-400">
                <span>○</span>
                <div>
                  <strong>Insurance active</strong>
                  <span className="ml-2">— pending</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
            >
              Done / Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Stepper Review Screen per PRD §9 */
        <div className="py-4 space-y-5 text-xs">
          {/* Read-only Review Summary per PRD §9 */}
          <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200/90 space-y-3">
            <div className="font-bold text-gray-800 text-sm">
              Review Details Before Final Submission
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-gray-500">Farmer Name</span>
                <p className="font-bold text-gray-900 mt-0.5">{farmer.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Location</span>
                <p className="font-bold text-gray-900 mt-0.5">{farmer.district}, {farmer.state}</p>
              </div>
              <div>
                <span className="text-gray-500">Crop &amp; Land</span>
                <p className="font-bold text-gray-900 mt-0.5">{farmer.crop} ({farmer.area})</p>
              </div>
              <div>
                <span className="text-gray-500">Season</span>
                <p className="font-bold text-gray-900 mt-0.5">{farmer.season}</p>
              </div>
            </div>
          </div>

          {/* Document Checklist in Stepper */}
          <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200/90 space-y-2">
            <div className="font-bold text-gray-800">Attached Documents</div>
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div key={doc.id} className="py-1.5 flex items-center justify-between">
                  <span className="text-gray-700">{doc.name}</span>
                  <span
                    className={`font-semibold text-[11px] ${
                      doc.status === "Uploaded" || doc.status === "Verified"
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Buttons per PRD §9 */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              [EDIT DETAILS]
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white font-bold text-sm tracking-wide transition active:scale-[0.98] shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "SUBMIT REGISTRATION"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
