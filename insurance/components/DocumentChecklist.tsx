"use client";

import React, { useState } from "react";
import { DocumentItem, DocStatus } from "../types/insurance";
import Image from "next/image";
import uploadImg from "../image/image copy 3.png";

interface DocumentChecklistProps {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  onProceedToStepper?: () => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  setDocuments,
  onProceedToStepper,
}) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const handleUpload = (id: string) => {
    setUploadingId(id);
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: "Uploaded" as DocStatus } : doc));
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

  const activeDoc = documents.find(d => d.id === activeDocId);

  return (
    <>
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
                      onClick={() => setActiveDocId(doc.id)}
                      disabled={uploadingId === doc.id}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition active:scale-95 disabled:opacity-50 shadow-xs"
                    >
                      {uploadingId === doc.id ? "Uploading..." : "Upload"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveDocId(doc.id)}
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

      {/* Upload/Replace Modal */}
      {activeDocId && activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveDocId(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
            >
              ✕
            </button>
            <h3 className="text-xl font-black mb-1 text-gray-900">
              {activeDoc.status === "Pending" ? "Upload Document" : "Replace Document"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">
              Uploading for: <span className="font-bold text-gray-900">{activeDoc.name}</span>
            </p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-6 bg-emerald-50/50 mb-6 hover:bg-emerald-50 transition cursor-pointer group">
              <div className="w-32 h-32 relative mb-4 overflow-hidden rounded-xl bg-white shadow-sm border border-emerald-100 group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src={uploadImg} 
                  alt="Document Illustration" 
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">Click to browse or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setActiveDocId(null)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleUpload(activeDoc.id);
                  setActiveDocId(null);
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-extrabold hover:bg-emerald-700 transition shadow-md active:scale-95"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

