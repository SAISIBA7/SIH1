"use client";

import { mockFarmers } from "../data/farmers.mock";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

const tierInfo = {
  high: { badge: "bg-red-500/15 text-red-700 border border-red-500/30", Icon: AlertTriangle },
  medium: { badge: "bg-amber-500/15 text-amber-700 border border-amber-500/30", Icon: AlertCircle },
  low: { badge: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30", Icon: CheckCircle },
};

export default function FarmerRiskTable({ onRowSelect }: { onRowSelect?: (id: string) => void }) {
  const { t } = useLanguage();

  return (
    <section className="glass p-6">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
        {t('priority_farmers', 'Priority Farmers')}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1A1A1A]/10 text-xs font-bold text-[#6B6B66] uppercase tracking-wider">
              <th className="pb-3 px-3">{t('farmer', 'Farmer')}</th>
              <th className="pb-3 px-3">{t('crop', 'Crop')}</th>
              <th className="pb-3 px-3">{t('risk_score', 'Risk Score')}</th>
              <th className="pb-3 px-3">{t('location', 'Location')}</th>
              <th className="pb-3 px-3">{t('risk_reason', 'Risk Reason')}</th>
              <th className="pb-3 px-3">{t('loan_status', 'Loan Status')}</th>
              <th className="pb-3 px-3 text-right">{t('action', 'Action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]/10 text-sm">
            {mockFarmers.map((f) => {
              const { badge, Icon } = tierInfo[f.riskTier as keyof typeof tierInfo];
              return (
                <motion.tr
                  key={f.id}
                  className="hover:bg-white/40 cursor-pointer transition-colors"
                  onClick={() => onRowSelect?.(f.id)}
                >
                  <td className="py-3 px-3 font-semibold text-[#1A1A1A]">{f.name}</td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{f.crop}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badge}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {f.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{f.location}</td>
                  <td className="py-3 px-3 text-[#1A1A1A] font-medium">{f.riskReason}</td>
                  <td className="py-3 px-3 text-[#6B6B66]">{f.loanStatus}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowSelect?.(f.id);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg lime-accent hover:opacity-90 transition-opacity shadow-sm"
                    >
                      {t('view_details', 'View Details')}
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
