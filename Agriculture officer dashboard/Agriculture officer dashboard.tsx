"use client";

import { useState } from 'react';
import Image from 'next/image';
import bgDesktop from './img/1 (1).jpeg';
import bgMobile from './img/3.png';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RiskSummaryCards from './components/RiskSummaryCards';
import FarmerRiskTable from './components/FarmerRiskTable';
import DistressMap from './components/DistressMap';
import RiskAnalyticsCharts from './components/RiskAnalyticsCharts';
import AlertPanel from './components/AlertPanel';
import FarmerDetailPanel from './components/FarmerDetailPanel';
import InterventionModal from './components/InterventionModal';

export default function OfficerDashboardPage() {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [isInterventionOpen, setInterventionOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFarmerSelect = (id: string) => {
    setSelectedFarmerId(id);
  };

  const closeFarmerDetail = () => {
    setSelectedFarmerId(null);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="relative min-h-screen font-sans text-[#1A1A1A]">
      {/* Full-page fixed background image */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Laptop / Desktop Background */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src={bgDesktop}
            alt="Dashboard Background Desktop"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Mobile Background */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src={bgMobile}
            alt="Dashboard Background Mobile"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      {/* Page Content layout */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen p-4 gap-4">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto space-y-6 pr-1">
            <RiskSummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FarmerRiskTable onRowSelect={handleFarmerSelect} />
              <DistressMap />
            </div>
            <RiskAnalyticsCharts />
            <AlertPanel />
          </main>
        </div>
      </div>

      {/* Modals */}
      {selectedFarmerId && (
        <FarmerDetailPanel farmerId={selectedFarmerId} onClose={closeFarmerDetail} />
      )}
      <InterventionModal isOpen={isInterventionOpen} onClose={() => setInterventionOpen(false)} />
    </div>
  );
}
