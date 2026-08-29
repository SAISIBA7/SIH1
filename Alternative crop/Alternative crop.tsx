'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Droplets,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Sprout,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { CROPS_GUIDE_DATA, CropFullGuide } from '@/lib/cropGuideData';
import CropAudioPlayer from '@/components/CropAudioPlayer';
import CropAiChatbot from '@/components/CropAiChatbot';

export default function AlternativeCrop() {
  const alternativeCropKeys = ['groundnut', 'mustard', 'blackgram'];
  const [selectedCropId, setSelectedCropId] = useState<string>('groundnut');

  const selectedCrop: CropFullGuide =
    CROPS_GUIDE_DATA[selectedCropId] || CROPS_GUIDE_DATA.groundnut;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/40 to-lime-50 text-slate-900 p-3 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-white/90 hover:bg-white px-3.5 py-2 rounded-xl shadow-xs border border-emerald-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/full-crop-guide"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl border border-teal-200 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              Paddy &amp; Crop Master Guide
            </Link>
          </div>

          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
            📍 Mayurbhanj Agro-Climatic Advisory
          </span>
        </div>

        {/* Hero Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
          <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            AI Climate-Resilience &amp; Net Margin Advisory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Climate-Smart Alternative Crop Recommendations
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
            Mitigate rainfall deficit, enrich soil nitrogen, and boost your household profits by transitioning to resilient alternative crops with verified agronomic workflows.
          </p>

          {/* Workflow Pipeline Graphic */}
          <div className="mt-5 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center justify-between overflow-x-auto gap-2 text-xs font-extrabold text-slate-700 no-scrollbar">
            <div className="flex items-center gap-2 shrink-0 text-emerald-700">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
              Recommended Crop
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-2 shrink-0 text-teal-700">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">2</span>
              Here&apos;s Why Suitable
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-2 shrink-0 text-cyan-700">
              <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs">3</span>
              How to Grow It
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-2 shrink-0 text-amber-700">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">4</span>
              Farming Calendar &amp; Advisory
            </div>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Crop Selection Cards */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1">
              Top Ranked Alternative Crops
            </h2>

            {alternativeCropKeys.map((cropId) => {
              const crop = CROPS_GUIDE_DATA[cropId];
              const isSelected = crop.id === selectedCropId;

              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/20 border-emerald-700 scale-[1.01]'
                      : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-base">{crop.name}</h3>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {crop.suitabilityScore}% Match
                    </span>
                  </div>

                  <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'} italic mb-3`}>
                    {crop.scientificName}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                      <div className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>Water Saved</div>
                      <div className="font-bold">+{crop.waterSavingPct}%</div>
                    </div>
                    <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                      <div className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>Duration</div>
                      <div className="font-bold">{crop.durationDays.split(' ')[0]}d</div>
                    </div>
                    <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                      <div className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>Net Profit</div>
                      <div className="font-bold">{crop.netMarginPerAcre}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Paddy Comparison Card */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs space-y-2">
              <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <span>🌾</span> Compared to Conventional Paddy:
              </div>
              <p className="text-amber-950 font-medium leading-relaxed">
                Paddy requires ~1,400mm water with ₹24,500 net profit. Switching to <strong>{selectedCrop.name}</strong> saves <strong>{selectedCrop.waterSavingPct}% water</strong> and yields <strong>{selectedCrop.netMarginPerAcre}</strong> net margin per acre.
              </p>
            </div>
          </div>

          {/* Right Column: Complete 4-Step Structured Narrative */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: CROP SUITABILITY HERO */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md">
                    Step 1 · Recommended Alternative
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {selectedCrop.name} is Suitable
                  </h2>
                  <p className="text-xs font-semibold text-emerald-700 italic">
                    {selectedCrop.nameOdia} · {selectedCrop.scientificName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400">Projected Net Margin</span>
                  <div className="text-xl font-black text-emerald-700">
                    {selectedCrop.netMarginPerAcre} / acre
                  </div>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    Water Saved
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">+{selectedCrop.waterSavingPct}% vs Paddy</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Duration
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{selectedCrop.durationDays}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                    Expected Yield
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{selectedCrop.expectedYield.split('/')[0]}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
                    Mandi Price
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{selectedCrop.avgPricePerQtl}</div>
                </div>
              </div>

              {/* STEP 2: HERE'S WHY */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-teal-900">
                    Here&apos;s Why It Is Suitable for Your Farm:
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCrop.whySuitable.points.map((pt, idx) => (
                    <div key={idx} className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{pt.icon}</span>
                        <h4 className="font-extrabold text-xs text-emerald-950">{pt.title}</h4>
                      </div>
                      <p className="text-xs text-emerald-900 font-medium leading-relaxed">{pt.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Odia Audio Narration Bar */}
                <CropAudioPlayer
                  title={`Listen to Why ${selectedCrop.name} is Suitable in Odia 🔊`}
                  odiaText={`${selectedCrop.nameOdia}। ${selectedCrop.whySuitable.odiaExplanation} ଏହା ଧାନ ତୁଳନାରେ ${selectedCrop.waterSavingPct}% କମ୍ ପାଣି ନିଏ ଏବଂ ଏକର ପ୍ରତି ${selectedCrop.netMarginPerAcre} ଲାଭ ଦିଏ।`}
                  englishText={`Why grow ${selectedCrop.name}: ${selectedCrop.whySuitable.description} Net margin is ${selectedCrop.netMarginPerAcre} per acre.`}
                />
              </div>

              {/* STEP 3: HERE'S HOW TO GROW IT */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-cyan-900">
                    Here&apos;s How to Grow It (Agronomic Key Specs):
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Seed Rate &amp; Depth</div>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedCrop.howToGrowSummary.seedRate}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Row Spacing</div>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedCrop.howToGrowSummary.spacing}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Critical Nutrients</div>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedCrop.howToGrowSummary.fertilizerDose}</div>
                  </div>
                </div>

                {/* 3 Quick Stage Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedCrop.stages.slice(0, 3).map((st) => (
                    <div key={st.stageNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-800 mb-1">
                        <span>{st.icon}</span>
                        <span>Stage {st.stageNumber}: {st.stageName.split('(')[0]}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{st.keyGoal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 4: HERE'S YOUR ACTIVITY CALENDAR */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-amber-900">
                    Here&apos;s Your Activity Calendar Preview:
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedCrop.calendar.slice(0, 4).map((cal, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          Week {cal.week}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{cal.title}</div>
                          <div className="text-slate-600 mt-0.5">{cal.activity}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md shrink-0">
                        {cal.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct 1-Click Action to Full Crop Guide & Calendar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/full-crop-guide?crop=${selectedCrop.id}`}
                  className="flex-1 text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-700/20 transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <span>Open Full Cultivation Guide &amp; 7-Stage Calendar for {selectedCrop.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/market"
                  className="text-center bg-white hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-5 rounded-2xl border border-slate-200 transition-all text-xs sm:text-sm"
                >
                  Live APMC Mandi Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Agronomist Chatbot */}
      <CropAiChatbot
        currentCropName={selectedCrop.name}
        currentCropId={selectedCrop.id}
        currentStageName="Recommended Switch Advisory"
      />
    </div>
  );
}
