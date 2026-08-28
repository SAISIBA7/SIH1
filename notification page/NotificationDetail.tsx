'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useNotificationStore } from './store';
import { PriorityBadge } from './components/PriorityBadge';
import { ActionButton } from './components/ActionButton';
import VoiceButton from '../Government equipment schemes/components/VoiceButton';
import { TimelineGroup } from './components/TimelineGroup';
import { NotificationCard } from './components/NotificationCard';

export default function NotificationDetail({ id }: { id: string }) {
  const router = useRouter();
  const { notifications, markAsRead } = useNotificationStore();
  
  const notification = notifications.find((n: any) => n.id === id);
  const relatedAlerts = notifications.filter((n: any) => n.category === notification?.category && n.id !== id).slice(0, 3);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  if (!notification) {
    return (
      <div className="min-h-screen bg-[#F2F2EF] p-6 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Notification not found</h2>
        <button onClick={() => router.back()} className="text-blue-600 underline">Go Back</button>
      </div>
    );
  }

  const voiceText = `${notification.title}. ${notification.description}. Action required: ${notification.ctaLabel}.`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F2F2EF]">
      {/* Background Layer with blur and overlay */}
      <div className="fixed inset-0 z-0 bg-cover bg-center blur-md bg-white/20 [background-image:url('/notification-page/img/1(1).png')] [@media(aspect-ratio:9/16)]:![background-image:url('/notification-page/img/3.png')]" />
      
      {/* Content Shell */}
      <div className="relative z-10 max-w-4xl mx-auto min-h-screen px-4 py-6 md:py-8 flex flex-col md:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="flex-1">
          <header className="mb-6">
            <button 
              onClick={() => router.back()} 
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A1A1A] hover:opacity-75 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Notifications
            </button>
          </header>

          <div className="glass p-6 md:p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {notification.category}
              </span>
              <PriorityBadge priority={notification.priority} size="lg" />
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(notification.timestamp).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                })}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6">
              {notification.title}
            </h1>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">What this means</h2>
              <p className="text-[#1A1A1A] text-lg leading-relaxed">
                {notification.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Why you're seeing this</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-[#1A1A1A]">
                  <span className="text-[#6FBF73]">✓</span> Your district — Mayurbhanj
                </li>
                <li className="flex items-start gap-2 text-[#1A1A1A]">
                  <span className="text-[#6FBF73]">✓</span> Linked to your profile
                </li>
              </ul>
            </div>

            <div className="mb-8 bg-white/50 p-4 rounded-xl border border-gray-200">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended Action</h2>
              <p className="text-[#1A1A1A] mb-4">Review the details and take necessary steps to mitigate risks or claim benefits.</p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <ActionButton label={notification.ctaLabel} href={notification.ctaHref} className="w-full sm:w-auto px-8" />
                <VoiceButton textToRead={voiceText} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail: Related Alerts (Desktop only) */}
        {relatedAlerts.length > 0 && (
          <div className="hidden md:block w-72 shrink-0">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Related Alerts</h2>
            <TimelineGroup label="Recent">
              {relatedAlerts.map((alert: any) => (
                <NotificationCard key={alert.id} notification={alert} />
              ))}
            </TimelineGroup>
          </div>
        )}
      </div>
    </div>
  );
}
