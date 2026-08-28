import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CloudRain, Sprout, TrendingDown, Landmark, ShieldCheck, UserCheck } from 'lucide-react';
import { NotificationItem } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface NotificationCardProps {
  notification: NotificationItem;
  onClick?: () => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  const props = { className: "w-5 h-5", strokeWidth: 2 };
  switch (category) {
    case 'Risk': return <AlertTriangle {...props} />;
    case 'Weather': return <CloudRain {...props} />;
    case 'Crop Activities': return <Sprout {...props} />;
    case 'Market': return <TrendingDown {...props} />;
    case 'Government': return <Landmark {...props} />;
    case 'Insurance': return <ShieldCheck {...props} />;
    case 'Officer Updates': return <UserCheck {...props} />;
    default: return <AlertTriangle {...props} />;
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick }) => {
  const { category, priority, title, description, timestamp, ctaLabel, isRead } = notification;

  // Format time ago (very basic approximation)
  const timeAgo = (dateStr: string) => {
    const hours = Math.round((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.round(hours/24)} days ago`;
  };

  if (priority === 'critical') {
    return (
      <Link 
        href={`/notifications/${notification.id}`}
        onClick={onClick}
        className="block w-full text-left transition-transform hover:scale-[1.01]"
      >
        <div className="focus-card p-4 flex flex-col gap-3 relative overflow-hidden">
          {/* Critical card has solid black background (focus-card handles bg/text) */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-red-400">
              <CategoryIcon category={category} />
              <span className="font-semibold text-sm uppercase tracking-wider">{category} · CRITICAL</span>
            </div>
            <span className="text-xs opacity-75">{timeAgo(timestamp)}</span>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm opacity-90 line-clamp-2">{description}</p>
          </div>

          <div className="mt-2 flex justify-end">
            <span className="text-sm font-semibold underline decoration-2 underline-offset-4">{ctaLabel}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/notifications/${notification.id}`}
      onClick={onClick}
      className="block w-full text-left group"
    >
      <div className={`glass p-4 relative transition-all ${!isRead ? 'border-l-4 border-l-[#CFE362]' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${!isRead ? 'bg-[#CFE362]/20 text-[#1A1A1A]' : 'bg-gray-100 text-gray-500'}`}>
              <CategoryIcon category={category} />
            </span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{category}</span>
          </div>
          <div className="flex items-center gap-2">
            {priority !== 'info' && <PriorityBadge priority={priority} />}
            <span className="text-xs text-gray-500">{timeAgo(timestamp)}</span>
          </div>
        </div>
        
        <div className="ml-10">
          <h3 className={`text-base mb-1 text-[#1A1A1A] ${!isRead ? 'font-bold' : 'font-medium'}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1 mb-3">{description}</p>
          
          <div className="flex items-center text-sm font-semibold text-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity">
            {ctaLabel}
          </div>
        </div>
      </div>
    </Link>
  );
};
