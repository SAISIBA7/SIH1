import React from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';

interface AiReasoningSectionProps {
  aiLoading: boolean;
  aiExplanation: any;
  onReanalyze: () => void;
}

export default function AiReasoningSection({
  aiLoading,
  aiExplanation,
  onReanalyze
}: AiReasoningSectionProps) {
  return (
    <div className="bg-white/45 backdrop-blur-2xl rounded-[32px] border border-white/80 p-6 md:p-7 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.12)] flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-950/10 pb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800 text-[#CFE362] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Agronomist</span>
          </div>
          <button 
            onClick={onReanalyze} 
            disabled={aiLoading}
            className="text-xs text-emerald-950 hover:text-emerald-800 bg-white/70 hover:bg-white/95 px-3 py-1 rounded-full border border-white/90 shadow-sm flex items-center gap-1.5 font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin text-emerald-700' : ''}`} />
            <span>Re-analyze</span>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            AI Agronomic Reasoning
          </h3>
          <p className="text-xs text-slate-600 font-medium">Domain-tailored mitigation synthesis</p>
        </div>

        {aiLoading ? (
          <div className="p-8 text-center space-y-3 bg-white/40 rounded-2xl border border-white/70 backdrop-blur-md">
            <div className="w-9 h-9 border-3 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-700 font-bold">Querying Gemini AI Agronomy Engine...</p>
          </div>
        ) : (
          <div className="space-y-3.5 text-sm leading-relaxed">
            {/* Highlighted Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 text-xs font-bold flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{aiExplanation?.summary || "Critical dry spell detected during panicle initiation stage."}</span>
            </div>

            {/* AI Explanation Content Box */}
            <p className="whitespace-pre-line text-xs md:text-sm text-slate-800 font-medium bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/90 shadow-sm leading-relaxed">
              {aiExplanation?.ai_explanation || "The crop risk index reflects compounding moisture stress. Satellite NDVI indicates localized stress across Parcel B. Early corrective irrigation and potassium nitrate foliar spray are recommended within 48 hours."}
            </p>

            {/* Key Stress Drivers List */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Key Stress Drivers</h4>
              {(aiExplanation?.key_drivers || [
                "22% 14-day rainfall deficit in Baripada block",
                "Soil moisture down to 24% at 15cm depth",
                "Panicle initiation vulnerability window"
              ]).map((driver: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-800 bg-white/50 backdrop-blur-md px-3 py-2 rounded-xl border border-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      <Link 
        href="/recommended-actions"
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
      >
        <span>View Recommended Actions & Interventions</span>
        <ArrowRight className="w-4 h-4 text-[#CFE362]" />
      </Link>
    </div>
  );
}
