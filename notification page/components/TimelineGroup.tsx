import React from 'react';

interface TimelineGroupProps {
  label: string;
  children: React.ReactNode;
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({ label, children }) => {
  return (
    <div className="mb-6">
      <div className="sticky top-0 z-10 bg-[#F2F2EF]/90 backdrop-blur-sm py-2 mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</h3>
      </div>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};
