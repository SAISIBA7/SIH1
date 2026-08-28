"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, AlertTriangle, ArrowLeft, Sparkles, TrendingUp, 
  CloudRain, Droplets, DollarSign, Bug, ArrowRight, CheckCircle2, RefreshCw
} from 'lucide-react';

export default function RiskDetailsView() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [riskData, setRiskData] = useState<any>({
    overallScore: 78,
    riskLevel: 'HIGH',
    factors: [
      { name: 'Weather Stress (Rainfall Deficit)', score: 68, max: 100, level: 'HIGH', detail: '22% deficit in 14-day cumulative rainfall in Baripada block.' },
      { name: 'Soil Moisture Depletion', score: 64, max: 100, level: 'HIGH', detail: 'Moisture dropped to 24% at 15cm depth during flowering stage.' },
      { name: 'Market Volatility & Price Risk', score: 42, max: 100, level: 'MEDIUM', detail: 'Wholesale arrival surge expected within 10 days.' },
      { name: 'Credit & Repayment Pressure', score: 35, max: 100, level: 'LOW', detail: 'KCC repayment due on Nov 30; interest subvention active.' },
      { name: 'Pest & Disease Pressure', score: 22, max: 100, level: 'LOW', detail: 'Brown plant hopper activity within permissible threshold.' }
    ]
  });

  const [aiExplanation, setAiExplanation] = useState<any>(null);

  const fetchAiExplanation = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/risk-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: 'Paddy (Swarna)',
          riskScore: 78,
          weatherRisk: 68,
          marketRisk: 42,
          soilMoisture: '24% (Deficit)',
          district: 'Mayurbhanj, Odisha'
        })
      });
      const json = await res.json();
      if (json.success) {
        setAiExplanation(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAiExplanation();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F2EF] text-[#1A1A1A] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-sm text-sm font-medium hover:bg-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Live Distress Alert: Active
            </span>
          </div>
        </div>

        {/* Hero Score Card */}
        <div className="bg-[#1A1A1A] text-white rounded-[28px] p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide text-neutral-300">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                CROP DISTRESS ENGINE &bull; AWS RDS + GEMINI AI
              </div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                Farm Distress Risk Breakdown
              </h1>
              <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                Aggregated agronomic assessment combining satellite NDVI, on-field soil moisture, Doppler radar rainfall forecasts, and local APMC market price trends for <span className="text-[#CFE362] font-semibold">Paddy (Swarna MTU 7029)</span>.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Overall Distress Index</span>
              <div className="text-5xl md:text-6xl font-black text-red-400 tracking-tight">
                {riskData.overallScore}<span className="text-2xl text-neutral-400 font-normal">/100</span>
              </div>
              <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                HIGH DISTRESS LEVEL
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Factors & Gemini AI Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Risk Factor Bars (7 cols) */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-[28px] border border-white/60 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neutral-700" />
                Contributing Risk Factors
              </h2>
              <span className="text-xs text-neutral-500 font-medium">Updated 15 mins ago</span>
            </div>

            <div className="space-y-4">
              {riskData.factors.map((factor: any, idx: number) => {
                const isHigh = factor.score >= 60;
                const isMed = factor.score >= 40 && factor.score < 60;
                const barColor = isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500';
                const badgeColor = isHigh ? 'bg-red-50 text-red-700 border-red-200' : isMed ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white/90 border border-black/5 hover:border-black/10 transition shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-900">{factor.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                          {factor.score}% Risk
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`} 
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {factor.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Gemini AI Analysis & Reasoning (5 cols) */}
          <div className="lg:col-span-5 bg-white/70 backdrop-blur-md rounded-[28px] border border-white/60 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] text-[#CFE362] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Agronomist
                </div>
                <button 
                  onClick={fetchAiExplanation} 
                  disabled={aiLoading}
                  className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 font-medium transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                  Re-analyze
                </button>
              </div>

              <h3 className="text-lg font-bold text-neutral-900">
                AI Agronomic Reasoning
              </h3>

              {aiLoading ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-neutral-500 font-medium">Generating intelligent risk reasoning...</p>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
                  <div className="p-3.5 rounded-2xl bg-[#CFE362]/15 border border-[#CFE362]/40 text-neutral-900 text-xs font-medium">
                    {aiExplanation?.summary || "Critical dry spell detected during panicle initiation stage."}
                  </div>

                  <p className="whitespace-pre-line text-xs md:text-sm text-neutral-700 bg-white/90 p-4 rounded-2xl border border-black/5 shadow-inner">
                    {aiExplanation?.ai_explanation || "The crop risk index reflects compounding moisture stress. Satellite NDVI indicates localized stress across Parcel B. Early corrective irrigation and potassium nitrate foliar spray are recommended within 48 hours."}
                  </p>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Key Stress Drivers</h4>
                    {aiExplanation?.key_drivers?.map((driver: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-800">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/recommended-actions"
              className="w-full py-3 px-4 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>View Recommended Actions & Interventions</span>
              <ArrowRight className="w-4 h-4 text-[#CFE362]" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
