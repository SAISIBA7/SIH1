'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sprout, Calendar, Droplets, ShieldAlert, ArrowRight } from 'lucide-react';

interface StageGuide {
  stageNumber: number;
  stageName: string;
  daysSpan: string;
  tasks: string[];
  irrigationRule: string;
  nutritionAdvisory: string;
  diseaseProtection: string;
}

const PADDY_STAGES: StageGuide[] = [
  {
    stageNumber: 1,
    stageName: 'Land Preparation & Nursery Sowing',
    daysSpan: 'Days 1 – 25',
    tasks: ['Primary tillage & 2 passes of rotavator', 'Apply 4 tonnes FYM / cow dung manure per acre', 'Puddle and level the main field thoroughly', 'Prepare raised nursery beds (10m × 1m)'],
    irrigationRule: 'Maintain 2-3 cm shallow water in nursery bed during germination',
    nutritionAdvisory: 'Basal application: 20kg DAP + 15kg MOP during last puddling pass',
    diseaseProtection: 'Seed treatment with Carbendazim 2g / kg seed to prevent blast',
  },
  {
    stageNumber: 2,
    stageName: 'Transplanting & Early Establishment',
    daysSpan: 'Days 25 – 45',
    tasks: ['Transplant 20-25 day old seedlings at 2-3 seedlings per hill', 'Maintain 20cm × 15cm row spacing', 'Gap filling within 7 days of transplanting'],
    irrigationRule: 'Maintain 2 cm water layer for 10 days to encourage root anchoring',
    nutritionAdvisory: 'First top dressing: 15kg Urea + 5kg Zinc Sulphate at 15 DAT',
    diseaseProtection: 'Monitor for stem borer dead hearts; apply Chlorantraniliprole if needed',
  },
  {
    stageNumber: 3,
    stageName: 'Active Tillering & Panicle Initiation',
    daysSpan: 'Days 45 – 80',
    tasks: ['Mechanical weeding using cono-weeder or manual weeding', 'Monitor water level and maintain drainage bunds'],
    irrigationRule: 'Adopt Alternate Wetting and Drying (AWD) to strengthen root vigor',
    nutritionAdvisory: 'Second top dressing: 15kg Urea + 10kg MOP at panicle initiation',
    diseaseProtection: 'Preventive spray of Tricyclazole 75 WP (0.6g/L) for neck blast',
  },
  {
    stageNumber: 4,
    stageName: 'Flowering, Grain Filling & Harvest',
    daysSpan: 'Days 80 – 125',
    tasks: ['Keep bird scaring devices active during milky dough stage', 'Drain field completely 10-12 days prior to harvest', 'Harvest when 85-90% panicles turn golden straw color'],
    irrigationRule: 'Maintain saturation during flowering; stop all irrigation 10 days before cut',
    nutritionAdvisory: 'Optional foliar spray: 1% 13:0:45 (Potassium Nitrate) for bolder grain',
    diseaseProtection: 'Inspect for Brown Plant Hopper (BPH) at base of stems',
  },
];

export default function FullCropGuide() {
  const [activeStage, setActiveStage] = useState<number>(1);
  const current = PADDY_STAGES[activeStage - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/40 to-lime-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-white/80 hover:bg-white px-4 py-2 rounded-xl shadow-xs border border-emerald-200/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100/90 text-emerald-800 rounded-full border border-emerald-300">
            📖 Complete Lifecycle Master Guide
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-md">
          <div className="flex items-center gap-3 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            End-to-End Cultivation Protocol
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Paddy (Swarna / MTU 1010) Full Lifecycle Guide
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
            Step-by-step agronomist playbook from nursery sowing to mechanical harvesting and post-harvest mandi storage.
          </p>

          {/* Stepper Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6">
            {PADDY_STAGES.map((s) => {
              const isActive = s.stageNumber === activeStage;
              return (
                <button
                  key={s.stageNumber}
                  onClick={() => setActiveStage(s.stageNumber)}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className={`text-xs font-bold ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                    Stage {s.stageNumber} · {s.daysSpan}
                  </div>
                  <div className="font-bold text-sm truncate mt-0.5">{s.stageName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Details */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                Stage {current.stageNumber} of 4 ({current.daysSpan})
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">{current.stageName}</h2>
            </div>
            <div className="flex gap-2">
              <button
                disabled={activeStage === 1}
                onClick={() => setActiveStage((s) => Math.max(1, s - 1))}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                disabled={activeStage === 4}
                onClick={() => setActiveStage((s) => Math.min(4, s + 1))}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next Stage →
              </button>
            </div>
          </div>

          {/* Action Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Essential Field Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {current.tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-800">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-blue-50/80 border border-blue-200/70 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase mb-1.5">
                <Droplets className="w-4 h-4 text-blue-600" />
                Water &amp; Irrigation
              </div>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">{current.irrigationRule}</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/70 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase mb-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" />
                Nutrient Schedule
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">{current.nutritionAdvisory}</p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/70 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Plant Protection
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">{current.diseaseProtection}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
