"use client";

// Placeholder icons – replace with actual Lucide imports as needed
import { Home, AlertTriangle, MapPin, BarChart2, Bell, Database, Clock, Settings, Globe } from "lucide-react";

const navItems = [
  { name: "Command Center", icon: Home },
  { name: "High Risk Farmers", icon: AlertTriangle },
  { name: "Distress Map", icon: MapPin },
  { name: "Analytics", icon: BarChart2 },
  { name: "Alerts", icon: Bell },
  { name: "Farmer Database", icon: Database },
  { name: "Intervention History", icon: Clock },
  { name: "Settings", icon: Settings },
  { name: "Government Schemes", icon: Globe, href: "/government-equipment-schemes" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside className={`w-full md:w-64 glass flex flex-col p-4 md:p-6 text-[#1A1A1A] shrink-0 ${isOpen ? "block" : "hidden"} md:block`}> 
      {/* Logo */}
      <div className="mb-4 md:mb-8 flex items-center gap-3 px-2">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#CFE362] font-bold text-lg md:text-xl shadow-md">
          S
        </div>
        <span className="text-lg md:text-xl font-bold tracking-tight text-[#1A1A1A]">Smart Crop</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = idx === 0; // Command Center active
          return (
            <a
              key={item.name}
              href={item.href ?? "#"}
              className={`flex items-center gap-2 md:gap-3 py-2 px-3 md:py-2.5 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#CFE362] text-[#1A1A1A] font-semibold shadow-sm"
                  : "text-[#4A4A4A] hover:bg-white/40 hover:text-[#1A1A1A]"
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
