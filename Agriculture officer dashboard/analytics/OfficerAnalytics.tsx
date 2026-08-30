"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Download } from 'lucide-react';
import { KPICards } from './components/KPICards';
import { DistressTrendChart } from './components/DistressTrendChart';
import { DistressFactors } from './components/DistressFactors';
import { PriorityTable } from './components/PriorityTable';

export function OfficerAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [block, setBlock] = useState('ALL');
  
  const [overviewData, setOverviewData] = useState(null);
  const [trendData, setTrendData] = useState<{ data: any; insight: string }>({ data: null, insight: '' });
  const [factorsData, setFactorsData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ timeRange, block });
        
        const [overviewRes, trendRes, factorsRes, priorityRes] = await Promise.all([
          fetch(`/api/officer/analytics/overview?${params}`),
          fetch(`/api/officer/analytics/distress-trend?${params}`),
          fetch(`/api/officer/analytics/distress-factors?${params}`),
          fetch(`/api/officer/analytics/priority-interventions?limit=5&${params}`)
        ]);

        const overview = await overviewRes.json();
        const trend = await trendRes.json();
        const factors = await factorsRes.json();
        const priority = await priorityRes.json();

        setOverviewData(overview.data || null);
        setTrendData({ data: trend.data || null, insight: trend.insight || '' });
        setFactorsData(factors.data || null);
        setPriorityData(priority.data || null);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeRange, block]);

  return (
    <div className="relative min-h-screen font-sans text-white bg-black">
      {/* Background Images — desktop 16:9 */}
      <div className="fixed inset-0 z-0 hidden md:block">
        <Image 
          src="/analytics-bg/desktop.png"
          alt="Background" 
          fill 
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>
      {/* Background Images — mobile 9:16 */}
      <div className="fixed inset-0 z-0 block md:hidden">
        <Image 
          src="/analytics-bg/mobile.png"
          alt="Background" 
          fill 
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Distress Analytics
            </h1>
            <p className="text-white/70 text-lg">
              Jurisdiction Overview · Mayurbhanj District
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors backdrop-blur-md">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-grow md:flex-grow-0 min-w-[200px]">
            <MapPin className="w-4 h-4 text-white/50" />
            <select 
              value={block} 
              onChange={e => setBlock(e.target.value)}
              className="bg-transparent border-none text-white text-sm outline-none w-full cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-gray-900">All Blocks</option>
              <option value="Baripada" className="bg-gray-900">Baripada</option>
              <option value="Betnoti" className="bg-gray-900">Betnoti</option>
              <option value="Badasahi" className="bg-gray-900">Badasahi</option>
              <option value="Kuliana" className="bg-gray-900">Kuliana</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-grow md:flex-grow-0 min-w-[150px]">
            <Calendar className="w-4 h-4 text-white/50" />
            <select 
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-white text-sm outline-none w-full cursor-pointer appearance-none"
            >
              <option value="7d" className="bg-gray-900">Last 7 Days</option>
              <option value="15d" className="bg-gray-900">Last 15 Days</option>
              <option value="30d" className="bg-gray-900">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards data={overviewData} loading={loading} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DistressTrendChart data={trendData.data} insight={trendData.insight} loading={loading} />
          </div>
          <div>
            <DistressFactors data={factorsData} loading={loading} />
          </div>
        </div>

        {/* Priority Table */}
        <PriorityTable data={priorityData} loading={loading} />
      </div>
    </div>
  );
}
