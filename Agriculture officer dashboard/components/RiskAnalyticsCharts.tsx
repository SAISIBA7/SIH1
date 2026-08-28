"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { riskCounts } from "../data/farmers.mock";

const trendData = [
  { name: 'Q1', value: 60 },
  { name: 'Q2', value: 67 },
  { name: 'Q3', value: 72 },
  { name: 'Q4', value: 81 },
];

const distributionData = [
  { name: 'High', value: riskCounts.high, color: '#EF4444' },
  { name: 'Medium', value: riskCounts.medium, color: '#F59E0B' },
  { name: 'Low', value: riskCounts.low, color: '#10B981' },
];

export default function RiskAnalyticsCharts() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risk Trend Line Chart */}
      <div className="glass p-6">
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Risk Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <XAxis dataKey="name" stroke="#6B6B66" fontSize={12} tickLine={false} />
            <YAxis stroke="#6B6B66" fontSize={12} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.7)', color: '#1A1A1A' }} />
            <Line type="monotone" dataKey="value" stroke="#CFE362" strokeWidth={3} dot={{ r: 5, fill: '#1A1A1A' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* District Risk Distribution Pie Chart */}
      <div className="glass p-6">
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">District Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.7)', color: '#1A1A1A' }} />
            <Legend wrapperStyle={{ color: '#1A1A1A', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
