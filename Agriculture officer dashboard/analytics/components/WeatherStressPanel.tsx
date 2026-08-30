"use client";

import React from 'react';
import { CloudRain, Users, AlertTriangle, MapPin, Wheat } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WeatherData {
  rainfallDeviationPercent: number;
  farmersAffected: number;
  highRiskFarmers: number;
  mostAffectedCrop: string;
  mostAffectedBlock: string;
  chartData: { date: string; expected: number; actual: number }[];
}

interface Props {
  data: WeatherData | null;
  loading: boolean;
}

export function WeatherStressPanel({ data, loading }: Props) {
  if (loading || !data) {
    return (
      <div className="w-full h-72 bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
    );
  }

  const stats = [
    {
      label: 'Rainfall Deviation',
      value: `${data.rainfallDeviationPercent > 0 ? '+' : ''}${data.rainfallDeviationPercent}%`,
      icon: CloudRain,
      color: data.rainfallDeviationPercent < -15 ? 'text-red-400' : data.rainfallDeviationPercent < 0 ? 'text-amber-400' : 'text-emerald-400',
      bg: data.rainfallDeviationPercent < -15 ? 'bg-red-500/10' : data.rainfallDeviationPercent < 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10',
    },
    {
      label: 'Farmers Affected',
      value: data.farmersAffected.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'High Risk (Weather)',
      value: data.highRiskFarmers.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Most Affected Crop',
      value: data.mostAffectedCrop,
      icon: Wheat,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Most Affected Block',
      value: data.mostAffectedBlock,
      icon: MapPin,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-1">
        <CloudRain className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Weather Stress Analytics</h3>
      </div>
      <p className="text-white/60 text-sm mb-5">Rainfall deviation and its impact on farmer distress</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-3 rounded-xl ${stat.bg} border border-white/5 text-center`}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart: Expected vs Actual */}
      {data.chartData.length > 0 ? (
        <div className="w-full h-56">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Expected vs Actual Rainfall (mm)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend
                wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}
              />
              <Bar dataKey="expected" name="Expected" fill="rgba(96,165,250,0.5)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="actual" name="Actual" fill="rgba(239,68,68,0.6)" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-white/40 text-sm">
          No rainfall comparison data available
        </div>
      )}
    </div>
  );
}
