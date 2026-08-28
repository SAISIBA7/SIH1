"use client";

import React from "react";

export const InsuranceInfoCard: React.FC = () => {
  return (
    <section className="w-full rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-7 sm:p-9 shadow-lg text-gray-900 relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/80 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">ℹ️</span>
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
            ABOUT PMFBY CROP INSURANCE
          </span>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-200">
          Official Guidelines
        </span>
      </div>

      {/* Main Content (Always Visible & Extended) */}
      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <p>
          <strong className="text-gray-900">Pradhan Mantri Fasal Bima Yojana (PMFBY)</strong> provides comprehensive risk coverage against non-preventable natural perils for foodgrains, oilseeds, and annual commercial crops.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
          <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 shadow-xs">
            <strong className="text-gray-900 block mb-1 text-sm font-extrabold">Farmer Share of Premium</strong>
            <p className="text-xs text-gray-600 leading-relaxed">
              2% for Kharif foodgrains/oilseeds, 1.5% for Rabi crops, and 5% for Annual Commercial &amp; Horticultural crops. The remaining 80%+ is co-shared by Government.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 shadow-xs">
            <strong className="text-gray-900 block mb-1 text-sm font-extrabold">Coverage Scope</strong>
            <p className="text-xs text-gray-600 leading-relaxed">
              Covers prevented sowing (up to 25%), mid-season standing crop loss from localized calamities, and post-harvest damage (up to 14 days).
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <a
            href="https://pmfby.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-800 font-extrabold hover:underline text-xs flex items-center gap-1"
          >
            <span>Official PMFBY Portal Guidelines</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};
