"use client";

import { Search, Bell, Menu } from "lucide-react";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="glass flex items-center justify-between px-6 py-4 text-[#1A1A1A]">
      {/* Left side: burger menu on mobile */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-white/40 transition-colors"
        onClick={onToggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Agricultural Distress Command Center</h1>
        <span className="text-xs font-medium text-[#6B6B66]">Mayurbhanj District</span>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full hover:bg-white/40 text-[#1A1A1A] transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="relative p-2.5 rounded-full hover:bg-white/40 text-[#1A1A1A] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        </button>
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1A1A1A]/10">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold">
            AO
          </div>
          <span className="text-sm font-semibold text-[#1A1A1A]">Officer Name</span>
        </div>
      </div>
    </header>
  );
}
