"use client";

import React from "react";
import { BankScheme } from "../types/insurance";

interface SchemeDetailsProps {
  scheme: BankScheme;
  onApply: () => void;
  onBack: () => void;
}

export const SchemeDetails: React.FC<SchemeDetailsProps> = ({ scheme, onApply, onBack }) => {
  return (
    <div className="w-full rounded-2xl bg-white/95 backdrop-blur-2xl border border-white p-7 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">SCHEME DETAILS</span>
          <h2 className="text-xl font-black text-gray-950 mt-0.5">{scheme.schemeName}</h2>
          <p className="text-xs text-gray-500 mt-0.5">By {scheme.bankName}</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold text-gray-500 hover:text-gray-900 transition">
          &larr; Back to Schemes
        </button>
      </div>

      {/* Description */}
      {scheme.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{scheme.description}</p>
      )}

      {/* Coverage Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="col-span-2 sm:col-span-4 flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">⚠ Demo / Synthetic Data</span>
          <span className="text-[10px] text-gray-400">Financial values are illustrative until real backend data is supplied.</span>
        </div>
        {[
          { label: "Coverage Amount", value: scheme.coverageAmount },
          { label: "Farmer Premium", value: scheme.premium },
          { label: "Govt. Subsidy", value: scheme.subsidy },
          { label: "Policy Period", value: scheme.policyPeriod },
        ].map(({ label, value }) =>
          value ? (
            <div key={label} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="block text-gray-500 font-semibold">{label}</span>
              <span className="block font-bold text-gray-900">{value}</span>
            </div>
          ) : null
        )}
      </div>

      {/* Eligible Crops & Seasons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Crops Covered</h4>
          <div className="flex flex-wrap gap-1.5">
            {scheme.cropsCovered.map((c) => (
              <span key={c} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-full border border-emerald-200">{c}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Seasons</h4>
          <div className="flex flex-wrap gap-1.5">
            {scheme.eligibleSeasons?.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-full border border-amber-200">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3">Eligibility Criteria</h4>
        <ul className="space-y-2">
          {scheme.eligibilitySummary.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <span className="text-emerald-600 font-bold mt-0.5">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Required Documents */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3">Required Documents</h4>
        <ul className="space-y-2">
          {scheme.requiredDocuments.map((doc, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
              <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">{i + 1}</span>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onApply}
          disabled={scheme.availabilityStatus !== "available"}
          className="px-8 py-3 rounded-xl bg-[#28a745] hover:bg-[#218838] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition active:scale-[0.98] shadow-sm"
        >
          Apply for This Scheme
        </button>
      </div>
    </div>
  );
};
