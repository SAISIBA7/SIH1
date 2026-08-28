"use client";

import { riskCounts } from "../data/farmers.mock";
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, CheckCircle, Users } from "lucide-react";

export default function RiskSummaryCards() {
  const cards = [
    { label: "High Risk Farmers", value: riskCounts.high, variant: "focus", icon: AlertTriangle, iconColor: "text-red-400" },
    { label: "Medium Risk Farmers", value: riskCounts.medium, variant: "glass", icon: AlertCircle, iconColor: "text-amber-500" },
    { label: "Low Risk Farmers", value: riskCounts.low, variant: "glass", icon: CheckCircle, iconColor: "text-emerald-500" },
    { label: "Total Farmers Monitored", value: riskCounts.total, variant: "glass", icon: Users, iconColor: "text-[#1A1A1A]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const isFocus = c.variant === "focus";
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            className={`p-5 flex flex-col items-start justify-between ${isFocus ? "focus-card" : "glass"
              }`}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isFocus ? "text-gray-400" : "text-[#6B6B66]"}`}>
                {c.label}
              </span>
              <Icon className={`w-5 h-5 ${c.iconColor}`} />
            </div>
            <div className={`text-3xl font-extrabold ${isFocus ? "text-white" : "text-[#1A1A1A]"}`}>
              {c.value}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
