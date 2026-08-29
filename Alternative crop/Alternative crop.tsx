'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, TrendingUp, Droplets, ShieldCheck, Calendar, IndianRupee, Sprout } from 'lucide-react';

interface AlternativeCropData {
  id: string;
  name: string;
  scientificName: string;
  suitabilityScore: number;
  waterNeed: 'Low' | 'Medium' | 'High';
  durationDays: string;
  expectedYield: string;
  avgPricePerQtl: string;
  netMarginPerAcre: string;
  benefits: string[];
  climateResilience: string;
  marketDemand: 'Very High' | 'High' | 'Moderate';
}

const ALTERNATIVE_CROPS: AlternativeCropData[] = [
  {
    id: 'crop-mustard',
    name: 'Yellow Mustard (Pusa Bold)',
    scientificName: 'Brassica juncea',
    suitabilityScore: 94,
    waterNeed: 'Low',
    durationDays: '100 - 110 days',
    expectedYield: '8 - 10 Quintals / acre',
    avgPricePerQtl: '₹5,800',
    netMarginPerAcre: '₹34,500',
    benefits: ['Requires 60% less water than paddy', 'High oil content with local oil mill demand', 'Short winter turnaround window'],
    climateResilience: 'High tolerance to mild drought and late-season temperature spikes',
    marketDemand: 'Very High',
  },
  {
    id: 'crop-groundnut',
    name: 'Groundnut (TMV 2 / Kadiri 6)',
    scientificName: 'Arachis hypogaea',
    suitabilityScore: 91,
    waterNeed: 'Medium',
    durationDays: '115 - 125 days',
    expectedYield: '12 - 14 Quintals / acre',
    avgPricePerQtl: '₹6,400',
    netMarginPerAcre: '₹41,200',
    benefits: ['Fixes atmospheric nitrogen into soil', 'Strong oil expeller & confectionery demand', 'Excellent fodder value after harvesting'],
    climateResilience: 'Deep root system absorbs residual soil moisture effectively',
    marketDemand: 'High',
  },
  {
    id: 'crop-blackgram',
    name: 'Black Gram / Urad (PU 31)',
    scientificName: 'Vigna mungo',
    suitabilityScore: 89,
    waterNeed: 'Low',
    durationDays: '75 - 85 days',
    expectedYield: '5 - 6 Quintals / acre',
    avgPricePerQtl: '₹7,200',
    netMarginPerAcre: '₹28,800',
    benefits: ['Ultra-fast cash crop cycle', 'Zero fertilizer requirement for nitrogen', 'Guaranteed procurement at MSP'],
    climateResilience: 'Thrives in residual moisture post-kharif harvest',
    marketDemand: 'Very High',
  },
  {
    id: 'crop-maize',
    name: 'Hybrid Maize (Pioneer 3396)',
    scientificName: 'Zea mays',
    suitabilityScore: 87,
    waterNeed: 'Medium',
    durationDays: '105 - 115 days',
    expectedYield: '28 - 32 Quintals / acre',
    avgPricePerQtl: '₹2,250',
    netMarginPerAcre: '₹38,600',
    benefits: ['High feed mill & starch industry demand', 'Fully mechanizable from seeding to harvest', 'Stable commodity contract rates'],
    climateResilience: 'Moderate heat tolerance with low pest vulnerability in Rabi',
    marketDemand: 'High',
  },
];

export default function AlternativeCrop() {
  const [selectedCrop, setSelectedCrop] = useState<AlternativeCropData>(ALTERNATIVE_CROPS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/40 to-lime-50 text-slate-900 p-4 md:p-8">
      {/* Fixed subtle overlay */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-white/80 hover:bg-white px-4 py-2 rounded-xl shadow-xs border border-emerald-200/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100/90 text-emerald-800 rounded-full border border-emerald-300">
            📍 Mayurbhanj Agro-Climatic Zone
          </span>
        </div>

        {/* Hero Banner */}
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-md">
          <div className="flex items-center gap-3 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            AI Climate &amp; Economic Switch Advisory
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Alternative Crop Recommendations
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
            Mitigate rainfall deficit, optimize soil fertility, and maximize net profits per acre by switching to climate-resilient alternative crops tailored for your farm.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Crop Selection Cards */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Top Ranked Alternatives
            </h2>
            {ALTERNATIVE_CROPS.map((c) => {
              const isSelected = c.id === selectedCrop.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCrop(c)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20 border-emerald-700 scale-[1.01]'
                      : 'bg-white/80 hover:bg-white text-slate-800 border-emerald-100/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base">{c.name}</h3>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.suitabilityScore}% Match
                    </span>
                  </div>
                  <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'} italic mb-3`}>
                    {c.scientificName}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                      <div className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>Water</div>
                      <div className="font-bold">{c.waterNeed}</div>
                    </div>
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                      <div className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>Tenure</div>
                      <div className="font-bold">{c.durationDays.split(' ')[0]}d</div>
                    </div>
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                      <div className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>Net Profit</div>
                      <div className="font-bold">{c.netMarginPerAcre}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Crop Overview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedCrop.name}</h2>
                  <p className="text-xs font-semibold text-emerald-700 italic">{selectedCrop.scientificName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Projected Net Margin</span>
                  <div className="text-xl font-extrabold text-emerald-700">{selectedCrop.netMarginPerAcre} / acre</div>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    Water Need
                  </div>
                  <div className="font-bold text-slate-900">{selectedCrop.waterNeed} Need</div>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    Duration
                  </div>
                  <div className="font-bold text-slate-900">{selectedCrop.durationDays}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                    Exp. Yield
                  </div>
                  <div className="font-bold text-slate-900">{selectedCrop.expectedYield}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
                    Mandi Price
                  </div>
                  <div className="font-bold text-slate-900">{selectedCrop.avgPricePerQtl} / Qtl</div>
                </div>
              </div>

              {/* Climate Resilience */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">Climate Resilience Assessment</h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{selectedCrop.climateResilience}</p>
                  </div>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 mb-6">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Agronomic Advantages</h4>
                {selectedCrop.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    {b}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <Link
                  href="/crop-monitoring"
                  className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  Adopt &amp; Add to Crop Monitor →
                </Link>
                <Link
                  href="/market"
                  className="text-center bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-5 rounded-xl border border-slate-200 transition-all text-sm"
                >
                  View Live Mandi Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
