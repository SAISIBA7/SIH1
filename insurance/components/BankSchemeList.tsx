"use client";

import React, { useState } from "react";
import { BankScheme } from "../types/insurance";

interface BankSchemeListProps {
  schemes: BankScheme[];
  onSelectScheme: (scheme: BankScheme) => void;
  onBack: () => void;
}

export const BankSchemeList: React.FC<BankSchemeListProps> = ({
  schemes,
  onSelectScheme,
  onBack,
}) => {
  const [filter, setFilter] = useState<"all" | "relevant">("all");

  const banks = Array.from(new Set(schemes.map((s) => s.bankName)));

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
            AVAILABLE SCHEMES
          </span>
          <h2 className="text-xl font-black text-gray-950 mt-0.5">
            Select an Insurance Scheme
          </h2>
        </div>
        <button onClick={onBack} className="text-xs font-bold text-gray-500 hover:text-gray-900 transition">
          &larr; Back
        </button>
      </div>

      <div className="flex gap-2 text-xs font-bold">
        {(["all", "relevant"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full border transition ${
              filter === f
                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {f === "all" ? "All Banks" : "Eligible for Me"}
          </button>
        ))}
      </div>

      <div className="space-y-7">
        {banks.map((bankName) => {
          const bankSchemes = schemes.filter(
            (s) => s.bankName === bankName && (filter === "all" || s.availabilityStatus === "available")
          );
          if (bankSchemes.length === 0) return null;
          return (
            <div key={bankName} className="space-y-3">
              <h3 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest bg-white/50 inline-block px-3 py-1 rounded-full backdrop-blur-md mb-2 border border-white">&nbsp;&#x1F3E6; {bankName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {bankSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => onSelectScheme(scheme)}
                    className="flex flex-col text-left w-full h-full p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-2 transition-all duration-300 group shadow-lg min-h-[320px]"
                  >
                    {/* Top: Title & Info */}
                    <div className="flex-1 w-full flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 leading-tight mb-2">{scheme.schemeName}</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            🌾 {scheme.cropsCovered.join(", ")}<br/>
                            ☀️ {scheme.eligibleSeasons?.join(", ")}
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 text-[11px] font-extrabold rounded-xl border flex-shrink-0 ${
                          scheme.availabilityStatus === "available"
                            ? "bg-emerald-100/80 text-emerald-800 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                          {scheme.availabilityStatus === "available" ? "ELIGIBLE" : "REVIEW"}
                        </span>
                      </div>
                      
                      {/* Middle: Stats */}
                      <div className="mt-8 grid grid-cols-2 gap-4 text-sm w-full">
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                          <span className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1.5">Coverage</span>
                          <span className="block font-black text-gray-900 text-base">{scheme.coverageAmount || "N/A"}</span>
                        </div>
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                          <span className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1.5">Premium</span>
                          <span className="block font-black text-gray-900 text-base">{scheme.premium || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: CTA */}
                    <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-end w-full">
                      <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
                        View Details <span className="text-xl leading-none">&rarr;</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
