"use client";

import { Home, AlertTriangle, MapPin, BarChart2, Bell, Database, Clock, Settings, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const navItems = [
  { key: "command_center", defaultName: "Command Center", icon: Home },
  { key: "high_risk_farmers", defaultName: "High Risk Farmers", icon: AlertTriangle, href: "/officer-dashboard/farmers" },
  { key: "distress_map", defaultName: "Distress Map", icon: MapPin },
  { key: "analytics", defaultName: "Analytics", icon: BarChart2 },
  { key: "alerts", defaultName: "Alerts", icon: Bell, href: "/notifications" },
  { key: "farmer_database", defaultName: "Farmer Database", icon: Database, href: "/officer-dashboard/farmers" },
  { key: "intervention_history", defaultName: "Intervention History", icon: Clock },
  { key: "settings", defaultName: "Settings", icon: Settings },
  { key: "government_schemes", defaultName: "Government Schemes", icon: Globe, href: "/schemes" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { t } = useLanguage();

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
          const isActive = idx === 0;
          const translatedName = t(item.key, item.defaultName);
          return (
            <a
              key={item.key}
              href={item.href ?? "#"}
              className={`flex items-center gap-2 md:gap-3 py-2 px-3 md:py-2.5 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#CFE362] text-[#1A1A1A] font-semibold shadow-sm"
                  : "text-[#4A4A4A] hover:bg-white/40 hover:text-[#1A1A1A]"
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <span>{translatedName}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
