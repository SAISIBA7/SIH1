"use client";

import { mockFarmers } from '../data/farmers.mock';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function FarmerDetailPanel({ farmerId, onClose }: { farmerId: string; onClose: () => void }) {
  const farmer = mockFarmers.find((f) => f.id === farmerId);
  if (!farmer) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-neutral-900 border border-white/20 p-6 rounded-lg w-96 relative shadow-2xl text-white"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white mb-2">{farmer.name}</h2>
          <p className="text-sm text-gray-300 mb-1">Crop: <span className="text-white font-medium">{farmer.crop}</span></p>
          <p className="text-sm text-gray-300 mb-1">Location: <span className="text-white font-medium">{farmer.location}</span></p>
          <p className="text-sm text-gray-300 mb-1">Risk Score: <span className="text-lime-400 font-bold">{farmer.riskScore}/100</span></p>
          <p className="text-sm text-gray-300 mb-4">Reason: <span className="text-white">{farmer.riskReason}</span></p>
          <div className="flex gap-2 justify-between">
            <button className="px-3 py-1.5 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition-colors">Call Farmer</button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition-colors">Send SMS</button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition-colors">Assign Visit</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
