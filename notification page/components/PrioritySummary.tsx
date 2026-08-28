import React from 'react';
import { NotificationItem } from '../types';
import { NotificationCard } from './NotificationCard';
import VoiceButton from '../../Government equipment schemes/components/VoiceButton';

interface PrioritySummaryProps {
  criticalAlert?: NotificationItem;
  unreadCount: number;
  actionNeededCount: number;
}

export const PrioritySummary: React.FC<PrioritySummaryProps> = ({ 
  criticalAlert, 
  unreadCount, 
  actionNeededCount 
}) => {
  if (criticalAlert) {
    return (
      <div className="mb-6">
        <NotificationCard notification={criticalAlert} />
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-sm text-[#1A1A1A] font-medium">
            {unreadCount} unread · {actionNeededCount} need action
          </p>
        </div>
        {/* Voice button placed inside priority area */}
        <div className="flex justify-end mt-2">
          <VoiceButton textToRead="You have new critical alerts and updates." />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 glass p-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-[#1A1A1A]">You're all caught up</h2>
        <p className="text-sm text-gray-600">
          {unreadCount} unread · {actionNeededCount} need action
        </p>
      </div>
      <div className="text-2xl">🔔</div>
    </div>
  );
};
