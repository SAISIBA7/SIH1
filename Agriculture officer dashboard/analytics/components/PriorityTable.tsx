"use client";

import React from 'react';
import { Phone, MessageSquare, UserPlus, AlertCircle } from 'lucide-react';

interface Farmer {
  id: string;
  name: string;
  phone: string;
  block: string;
  crop: string;
  distressScore: number;
  primaryFactor: string;
  interventionStatus: string;
}

interface Props {
  data: Farmer[] | null;
  loading: boolean;
}

export function PriorityTable({ data, loading }: Props) {
  if (loading || !data) {
    return (
      <div className="w-full h-96 bg-white/5 border border-white/10 rounded-2xl animate-pulse mt-8"></div>
    );
  }

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md mt-8">
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Priority Interventions</h3>
          <p className="text-white/60 text-sm">Top high-risk farmers requiring immediate attention</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm font-medium hover:bg-emerald-500/30 transition-colors">
          View All Farmers
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/60 text-sm">
              <th className="p-4 font-medium">Farmer</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Risk Profile</th>
              <th className="p-4 font-medium text-center">Score</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/40">
                  No priority interventions found for this period.
                </td>
              </tr>
            ) : (
              data.map((farmer, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{farmer.name}</p>
                        <p className="text-white/40 text-xs">{farmer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white/80">{farmer.block}</p>
                    <p className="text-white/40 text-xs">{farmer.crop}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-red-400 text-sm bg-red-500/10 px-2 py-1 rounded w-fit">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{farmer.primaryFactor}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 text-red-400 font-bold bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                      {farmer.distressScore}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors" title="Call Farmer">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors" title="Send SMS">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4" />
                        <span>Assign</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
