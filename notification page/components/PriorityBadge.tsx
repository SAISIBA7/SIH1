import React from 'react';
import { PriorityLevel } from '../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const isSm = size === 'sm';
  
  const baseClasses = `inline-flex items-center justify-center font-bold uppercase rounded-full ${
    isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
  }`;

  const styles = {
    critical: 'bg-[#1A1A1A] text-white',
    warning: 'bg-[#F0B942] text-[#1A1A1A]',
    info: 'bg-[#6FBF73] text-[#1A1A1A]',
  };

  return (
    <span className={`${baseClasses} ${styles[priority]}`}>
      {priority}
    </span>
  );
};
