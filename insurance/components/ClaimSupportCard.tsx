"use client";

import React, { useState } from "react";

export const ClaimSupportCard: React.FC = () => {
  const [lossReported, setLossReported] = useState(false);

  return (
    <section className="w-full rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-7 sm:p-9 shadow-lg text-gray-900 relative select-none">
      <div className="space-y-5">
        {/* Header row per PRD §5 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🆘</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
              CLAIM SUPPORT (STATUS-ONLY)
            </span>
          </div>

          <div className="text-xs font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            72h Loss Intimation Rule
          </div>
        </div>

        {/* Claim Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 shadow-xs">
            <strong className="text-gray-900 block mb-1 text-sm">📞 PMFBY Toll-Free Helpline</strong>
            <p className="text-gray-600 leading-relaxed text-xs">
              Call <strong className="text-emerald-950 font-bold">14447</strong> or <strong className="text-emerald-950 font-bold">1800-180-1551</strong> within 72 hours of localized distress to initiate loss survey.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 shadow-xs">
            <strong className="text-gray-900 block mb-1 text-sm">🏛️ District Agriculture Office</strong>
            <p className="text-gray-600 leading-relaxed text-xs">
              Baripada, Mayurbhanj, Odisha · Joint survey conducted by Block Agriculture Officer &amp; AIC Assessor.
            </p>
          </div>
        </div>

        {lossReported ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center justify-between">
            <span>✓ <strong>Intimation Logged:</strong> Mock docket #DOCKET-MAYUR-2026 drafted for survey.</span>
            <button onClick={() => setLossReported(false)} className="text-gray-600 hover:text-gray-900 underline font-semibold">
              Reset
            </button>
          </div>
        ) : (
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-gray-700">
            <span className="font-medium">Experiencing localized crop distress right now?</span>
            <button
              onClick={() => setLossReported(true)}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm transition active:scale-95 shadow-sm"
            >
              Report Localized Loss (72h) →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
