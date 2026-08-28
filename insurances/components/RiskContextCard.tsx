"use client";

import React from "react";
import { RiskProfile } from "../types/insurance";

interface RiskContextCardProps {
  risk: RiskProfile;
  onCheckEligibility: () => void;
}

export const RiskContextCard: React.FC<RiskContextCardProps> = ({
  risk,
  onCheckEligibility,
}) => {
  return (
    <section className="w-full rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-7 sm:p-9 shadow-lg text-gray-900 relative select-none">
      <div className="space-y-5">
        {/* Header row per PRD §5 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚨</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
              WHY THIS MATTERS
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-950 text-xs sm:text-sm font-black tracking-wide shadow-xs">
            <span className="animate-pulse">🔴</span>
            <span>{risk.score} / 100 HIGH RISK</span>
          </div>
        </div>

        {/* Factors list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1">
          {risk.factors.map((factor) => (
            <div
              key={factor.id}
              className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/90 flex flex-col justify-between gap-2 shadow-xs hover:border-gray-300 transition"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <span className="text-xl">{factor.icon}</span>
                <span>{factor.label}</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-700 font-bold leading-snug">{factor.value}</p>
            </div>
          ))}
        </div>

        {/* Bridge to Insurance per PRD §12 */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-emerald-950 text-sm uppercase tracking-wide">
              INSURANCE MAY HELP
            </div>
            <p className="text-emerald-900 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
              You may be eligible for crop insurance based on your crop, location and season.
            </p>
          </div>

          <button
            onClick={onCheckEligibility}
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-sm transition active:scale-95 flex-shrink-0"
          >
            CHECK ELIGIBILITY →
          </button>
        </div>
      </div>
    </section>
  );
};
