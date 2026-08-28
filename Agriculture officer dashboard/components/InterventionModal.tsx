"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const interventions = [
  { id: 'field', label: 'Field Inspection' },
  { id: 'insurance', label: 'Insurance Registration' },
  { id: 'crop', label: 'Alternative Crop Assessment' },
];

export default function InterventionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-neutral-900 border border-white/20 p-6 rounded-lg w-80 shadow-2xl text-white"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Select Intervention</h3>
            <ul className="space-y-2">
              {interventions.map((intv) => (
                <li key={intv.id} className="flex items-center p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                  <CheckCircle className="w-5 h-5 text-lime-400 mr-3" />
                  <span className="text-sm text-gray-200">{intv.label}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onClose}
              className="mt-5 w-full py-2 bg-lime-400 text-black font-semibold text-sm rounded-lg hover:bg-lime-300 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
