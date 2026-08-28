"use client";

import React, { useState } from "react";
import { FarmerProfile } from "../types/insurance";

interface EligibilityCardProps {
  farmer: FarmerProfile;
  onUpdateFarmer: (updated: Partial<FarmerProfile>) => void;
  onContinue: () => void;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  farmer,
  onUpdateFarmer,
  onContinue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    crop: farmer.crop,
    area: farmer.area,
    district: farmer.district,
    season: farmer.season,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarmer(formData);
    setIsEditing(false);
  };

  return (
    <section className="w-full rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-7 sm:p-9 shadow-lg text-gray-900 relative select-none">
      <div className="space-y-5">
        {/* Header row per PRD §5 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-emerald-700 font-black text-lg">✓</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
              ELIGIBILITY (PRE-FILLED, EDITABLE)
            </span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 underline px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition"
          >
            {isEditing ? "Cancel" : "[EDIT DETAILS]"}
          </button>
        </div>

        {/* We already have this notice per PRD §8 */}
        <div className="text-xs sm:text-sm text-gray-600 font-semibold">
          ✓ We already have this information from your registered farm profile:
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Crop</label>
              <input
                type="text"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Land Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition shadow-sm"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/90 shadow-xs">
              <span className="text-gray-500 block text-xs font-medium">Crop</span>
              <span className="font-extrabold text-gray-900 mt-1 block text-sm sm:text-base">{farmer.crop} ✓</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/90 shadow-xs">
              <span className="text-gray-500 block text-xs font-medium">Land Area</span>
              <span className="font-extrabold text-gray-900 mt-1 block text-sm sm:text-base">{farmer.area} ✓</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/90 shadow-xs">
              <span className="text-gray-500 block text-xs font-medium">Location</span>
              <span className="font-extrabold text-gray-900 mt-1 block text-sm sm:text-base">{farmer.district} ✓</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/90 shadow-xs">
              <span className="text-gray-500 block text-xs font-medium">Season</span>
              <span className="font-extrabold text-gray-900 mt-1 block text-sm sm:text-base">{farmer.season} ✓</span>
            </div>
          </div>
        )}

        {/* Cautious Hedged Outcome Notice per PRD §8 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center justify-between flex-wrap gap-2">
          <span>✓ <strong>Potentially Eligible:</strong> Your Paddy crop in Mayurbhanj matches active PMFBY Kharif notification.</span>
          <span className="text-xs text-emerald-800 italic font-medium">*Based on available information</span>
        </div>

        {/* Primary CTA per PRD §5 */}
        <div className="pt-2">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#28a745] hover:bg-[#218838] text-white font-extrabold text-sm sm:text-base tracking-wide transition active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            CONTINUE →
          </button>
        </div>
      </div>
    </section>
  );
};
