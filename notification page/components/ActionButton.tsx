import React from 'react';
import Link from 'next/link';

interface ActionButtonProps {
  label: string;
  href: string;
  variant?: 'primary' | 'quiet';
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  href, 
  variant = 'primary',
  className = '' 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 text-sm transition-colors text-center";
  
  const styles = {
    primary: "bg-[#CFE362] text-[#1A1A1A] hover:bg-[#b8ce4e]",
    quiet: "bg-transparent text-[#1A1A1A] border border-gray-300 hover:bg-gray-50",
  };

  return (
    <Link href={href} className={`${baseClasses} ${styles[variant]} ${className}`}>
      {label}
    </Link>
  );
};
