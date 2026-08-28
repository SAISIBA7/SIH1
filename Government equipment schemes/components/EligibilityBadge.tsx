'use client';

import React from 'react';

interface EligibilityBadgeProps {
  percent: number;
  size?: 'sm' | 'lg';
  showLabel?: boolean;
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  percent,
  size = 'sm',
  showLabel = true,
}) => {
  let tierClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let dotClasses = 'bg-emerald-600';

  if (percent < 50) {
    tierClasses = 'bg-gray-100 text-gray-700 border-gray-200';
    dotClasses = 'bg-gray-500';
  } else if (percent < 80) {
    tierClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    dotClasses = 'bg-amber-500';
  }

  if (size === 'lg') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md font-semibold text-sm shadow-sm ${tierClasses}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${dotClasses}`} />
        <span>{percent}% {showLabel ? 'Match' : ''}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold backdrop-blur-sm ${tierClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
      <span>{percent}% match</span>
    </div>
  );
};

export default EligibilityBadge;
