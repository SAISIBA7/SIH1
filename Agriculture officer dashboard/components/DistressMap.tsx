"use client";


export default function DistressMap() {
  return (
    <section className="glass p-6 flex flex-col justify-between h-full min-h-[300px] relative overflow-hidden">
      <div className="flex items-center justify-between z-10 mb-2">
        <h2 className="text-lg font-bold text-[#1A1A1A]">Distress Map</h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-700 border border-red-500/20">
          Mayurbhanj District • Live
        </span>
      </div>

      {/* Abstract stylized map view */}
      <div className="flex-1 w-full relative rounded-2xl bg-[#E6E8E2]/60 border border-white/50 overflow-hidden flex items-center justify-center">
        {/* Abstract topographic contour lines SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-30 stroke-[#1A1A1A]/30 fill-none" viewBox="0 0 400 200">
          <path d="M-20,100 Q80,20 200,100 T420,80" strokeWidth="1.5" />
          <path d="M-20,140 Q100,50 240,150 T420,120" strokeWidth="1.5" />
          <path d="M-20,60 Q120,160 280,40 T420,160" strokeWidth="1.5" />
          <circle cx="120" cy="90" r="45" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="280" cy="110" r="60" strokeWidth="1" strokeDasharray="3,3" />
        </svg>

        {/* Map markers for district risk zones */}
        <div className="absolute top-[35%] left-[28%] flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-red-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-[#1A1A1A]">Zone A (High Risk)</span>
        </div>

        <div className="absolute top-[55%] left-[62%] flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-amber-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-[#1A1A1A]">Zone B (Medium)</span>
        </div>

        <div className="absolute top-[25%] left-[68%] flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-emerald-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-[#1A1A1A]">Zone C (Normal)</span>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-bold text-[#6B6B66] tracking-wider uppercase bg-white/60 px-2 py-0.5 rounded-md">
          Abstract Spatial Distress View
        </div>
      </div>
    </section>
  );
}
