"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Tractor, ArrowLeft, Calendar, ShieldCheck, MapPin, 
  CheckCircle2, Clock, Phone, DollarSign, Sparkles
} from 'lucide-react';

export default function EquipmentDetailView({ equipmentId }: { equipmentId: string }) {
  const [days, setDays] = useState(1);
  const [operatorRequired, setOperatorRequired] = useState(true);
  const [booked, setBooked] = useState(false);

  const baseDailyRate = 900;
  const operatorFeePerDay = operatorRequired ? 250 : 0;
  const totalCost = (baseDailyRate + operatorFeePerDay) * days;

  return (
    <div className="min-h-screen bg-[#F2F2EF] text-[#1A1A1A] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/equipment" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-sm text-sm font-medium hover:bg-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Equipment Hub
          </Link>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Available at CHC Hub
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-[#1A1A1A] text-white rounded-[28px] p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-xs font-bold text-[#CFE362] uppercase tracking-wider">Custom Hiring Center (CHC) &bull; {equipmentId}</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mahindra 575 DI (45 HP) Tractor</h1>
            <p className="text-neutral-300 text-xs md:text-sm max-w-2xl">
              High-torque agricultural tractor equipped with rotavator and disc plough attachments. Ideal for primary land preparation, tilling, and haulage in loamy & alluvial soils.
            </p>
          </div>
        </div>

        {/* Booking Form & Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Specs (7 cols) */}
          <div className="md:col-span-7 bg-white/80 backdrop-blur-md rounded-[28px] p-6 border border-black/5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-neutral-700" />
              Technical Specifications & Hub Location
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 font-medium">Engine Output</span>
                <div className="font-bold text-neutral-900 text-sm mt-0.5">45 HP @ 1900 RPM</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 font-medium">Fuel Consumption</span>
                <div className="font-bold text-neutral-900 text-sm mt-0.5">3.8 L / Hour (Approx)</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 font-medium">CHC Hub</span>
                <div className="font-bold text-neutral-900 text-sm mt-0.5">Baripada Block Center</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 font-medium">Subsidy Applicable</span>
                <div className="font-bold text-emerald-700 text-sm mt-0.5">50% DBT on Fuel</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <div className="font-bold text-neutral-900">Included Attachments:</div>
              <div className="text-neutral-600">&bull; 42-blade heavy duty rotavator</div>
              <div className="text-neutral-600">&bull; 3-bottom reversible disc plough</div>
            </div>
          </div>

          {/* Booking / Rental Calculator (5 cols) */}
          <div className="md:col-span-5 bg-white/90 backdrop-blur-md rounded-[28px] p-6 border border-black/10 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-neutral-900">Instant CHC Rental Booking</h3>

              {booked ? (
                <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2 border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900 text-sm">Booking Confirmed!</div>
                  <p className="text-xs text-emerald-800">
                    Your CHC token #CHC-8912 has been registered. The operator will contact you 2 hours prior to arrival.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-600 font-semibold mb-1">Rental Duration (Days)</label>
                    <input 
                      type="number"
                      min={1}
                      max={14}
                      value={days}
                      onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-neutral-50 border border-black/10 rounded-xl font-bold text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <span className="font-medium text-neutral-700">Include Certified Operator</span>
                    <input 
                      type="checkbox"
                      checked={operatorRequired}
                      onChange={(e) => setOperatorRequired(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-900"
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3 bg-neutral-100 rounded-xl space-y-1 text-neutral-700">
                    <div className="flex justify-between">
                      <span>Machinery Charge ({days}d &times; ₹{baseDailyRate})</span>
                      <span className="font-semibold">₹{days * baseDailyRate}</span>
                    </div>
                    {operatorRequired && (
                      <div className="flex justify-between">
                        <span>Operator Daily Fee ({days}d &times; ₹250)</span>
                        <span className="font-semibold">₹{days * 250}</span>
                      </div>
                    )}
                    <div className="border-t border-neutral-300 pt-1 flex justify-between font-bold text-sm text-neutral-900">
                      <span>Total Estimated Cost</span>
                      <span className="text-emerald-700">₹{totalCost}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBooked(true)}
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
                  >
                    Confirm CHC Rental Request
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
