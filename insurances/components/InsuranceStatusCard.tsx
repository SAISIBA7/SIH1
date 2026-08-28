"use client";

import React from "react";
import { FarmerProfile, InsuranceState } from "../types/insurance";

interface InsuranceStatusCardProps {
  farmer: FarmerProfile;
  status: InsuranceState;
  onPrimaryAction: () => void;
}

export const InsuranceStatusCard: React.FC<InsuranceStatusCardProps> = ({
  farmer,
  status,
  onPrimaryAction,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "NOT_REGISTERED":
        return {
          icon: "⚠️",
          title: "NOT REGISTERED",
          badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
          subline: `${farmer.crop} · ${farmer.area} · ${farmer.district}`,
          desc: "You are currently not registered for crop insurance. You may be eligible based on your crop and location.",
          ctaText: "CHECK ELIGIBILITY",
          ctaStyle: "bg-[#28a745] hover:bg-[#218838] text-white shadow-md hover:shadow-lg",
        };
      case "ELIGIBLE":
        return {
          icon: "✓",
          title: "ELIGIBLE",
          badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-300",
          subline: `Crop: ${farmer.crop} · Area: ${farmer.area} · Season: ${farmer.season}`,
          desc: "You appear eligible for crop insurance based on your notified crop and location.",
          ctaText: "CONTINUE REGISTRATION",
          ctaStyle: "bg-[#28a745] hover:bg-[#218838] text-white shadow-md hover:shadow-lg",
        };
      case "APPLICATION_PENDING":
        return {
          icon: "🟡",
          title: "APPLICATION PENDING",
          badgeBg: "bg-blue-100 text-blue-950 border-blue-300",
          subline: "Submitted 12 Aug 2026 · Application ID INS-2026-00124",
          desc: "Status: Under review by District Agriculture Department.",
          ctaText: "VIEW APPLICATION STATUS",
          ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
        };
      case "ACTIVE":
        return {
          icon: "🟢",
          title: "INSURANCE ACTIVE",
          badgeBg: "bg-green-100 text-green-950 border-green-300",
          subline: `Crop: ${farmer.crop} · Area: ${farmer.area} · Status: ACTIVE`,
          desc: "Your crop is protected under PMFBY policy #PMFBY-OD-2026-98741.",
          ctaText: "VIEW POLICY DETAILS",
          ctaStyle: "bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg",
        };
      case "ACTION_REQUIRED":
        return {
          icon: "⚠️",
          title: "ACTION REQUIRED",
          badgeBg: "bg-rose-100 text-rose-950 border-rose-300",
          subline: "Missing: Land record",
          desc: "Your application needs additional information to proceed with scrutiny.",
          ctaText: "COMPLETE APPLICATION",
          ctaStyle: "bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <section className="w-full rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-7 sm:p-9 shadow-lg text-gray-900 relative select-none">
      <div className="space-y-5">
        {/* Header Label per PRD §5 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
            YOUR INSURANCE STATUS
          </span>

          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black tracking-wide ${config.badgeBg}`}
          >
            <span>{config.icon}</span>
            <span>{config.title}</span>
          </div>
        </div>

        {/* Farmer Crop / Area / Location Line */}
        <div className="space-y-2">
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
            {config.subline}
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
            {config.desc}
          </p>
        </div>

        {/* Primary CTA (Single filled button per state per PRD §13) */}
        <div className="pt-2">
          <button
            onClick={onPrimaryAction}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base tracking-wide transition-all active:scale-[0.98] ${config.ctaStyle}`}
          >
            {config.ctaText}
          </button>
        </div>
      </div>
    </section>
  );
};
