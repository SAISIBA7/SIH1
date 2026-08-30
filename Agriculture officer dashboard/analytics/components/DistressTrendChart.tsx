"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart } from 'recharts';

interface TrendData {
  date: string;
  avgScore: number;
  highRiskCount: number;
}

interface Props {
  data: TrendData[] | null;
  loading: boolean;
  insight: string;
}

export function DistressTrendChart({ data, loading, insight }: Props) {
  if (loading || !data) {
    return (
      <div className="w-full h-72 bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
    );
  }

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Distress Trend</h3>
          <p className="text-white/60 text-sm">Average risk score vs high-risk volume</p>
        </div>
        <div className="mt-2 md:mt-0 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <p className="text-blue-400 text-sm font-medium">{insight}</p>
        </div>
      </div>
      
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar yAxisId="right" dataKey="highRiskCount" name="High Risk Count" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} barSize={20} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="avgScore" 
              name="Avg Risk Score"
              stroke="#ef4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
