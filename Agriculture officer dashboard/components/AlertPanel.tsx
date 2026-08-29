"use client";
import { mockAlerts } from "../data/farmers.mock";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

export default function AlertPanel() {
  const { t } = useLanguage();

  return (
    <section className="glass p-6">
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
        {t('live_distress_alerts', 'Alerts & System Feeds')}
      </h3>
      <ul className="space-y-2.5">
        {mockAlerts.map((alert) => (
          <motion.li
            key={alert.id}
            className="flex items-start gap-3 p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600 flex-shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1A1A1A]">{alert.message}</p>
              <p className="text-xs text-[#6B6B66] mt-0.5">{alert.timestamp}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
