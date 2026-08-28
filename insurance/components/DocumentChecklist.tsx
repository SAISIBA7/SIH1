"use client";

import React, { useState } from "react";
import { DocumentItem, DocStatus } from "../types/insurance";

interface DocumentChecklistProps {
  documents: DocumentItem[];
  onUploadDoc: (id: string) => void;
  onProceedToStepper?: () => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  onUploadDoc,
  onProceedToStepper,
}) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleUpload = (id: string) => {
    setUploadingId(id);
    setTimeout(() => {
      onUploadDoc(id);
      setUploadingId(null);
    }, 600);
  };

  const getStatusPill = (status: DocStatus) => {
    switch (status) {
      case "Uploaded":
      case "Verified":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold";
      case "Pending":
        return "bg-amber-100 text-amber-950 border-amber-300 font-extrabold";
      case "Rejected":
        return "bg-rose-100 text-rose-950 border-rose-300 font-extrabold";
    }
  };

  return (
    <section className="w-full rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-7 sm:p-9 shadow-lg text-gray-900 relative select-none">
      <div className="space-y-5">
        {/* Header row per PRD §5 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📄</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
              REQUIRED DOCUMENTS
            </span>
          </div>

          <div className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {documents.filter((d) => d.status === "Uploaded" || d.status === "Verified").length} of {documents.length} Attached
          </div>
        </div>

        {/* Document list per PRD §10 */}
        <div className="divide-y divide-gray-200/80">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-base sm:text-lg font-black mt-0.5 text-emerald-700">
                  {doc.status === "Uploaded" || doc.status === "Verified" ? "✓" : "○"}
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-gray-900 text-sm sm:text-base">{doc.name}</span>
                    {doc.mandatory && (
                      <span className="text-[10px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-extrabold">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{doc.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <span
                  className={`px-3 py-1 rounded-full border text-xs ${getStatusPill(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>

                {doc.status === "Pending" ? (
                  <button
                    onClick={() => handleUpload(doc.id)}
                    disabled={uploadingId === doc.id}
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition active:scale-95 disabled:opacity-50 shadow-xs"
                  >
                    {uploadingId === doc.id ? "Uploading..." : "Upload"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpload(doc.id)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition border border-gray-200"
                  >
                    Replace
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA per PRD §5 */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
          {onProceedToStepper && (
            <button
              onClick={onProceedToStepper}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#28a745] hover:bg-[#218838] text-white font-extrabold text-sm sm:text-base tracking-wide transition active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              REGISTER FOR INSURANCE →
            </button>
          )}

          <div className="text-xs text-gray-500 italic">
            Mocked upload for hackathon demo per PRD §10.
          </div>
        </div>
      </div>
    </section>
  );
};
