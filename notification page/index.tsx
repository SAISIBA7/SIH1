'use client';

import React from 'react';
import Image from 'next/image';
import bgImage from './img/1(1).png';
import { NotificationHeader } from './components/NotificationHeader';
import { PrioritySummary } from './components/PrioritySummary';
import CategoryFilter from '../Government equipment schemes/components/CategoryFilter';
import { NotificationCard } from './components/NotificationCard';
import { TimelineGroup } from './components/TimelineGroup';
import { useNotificationStore } from './store';
import VoiceButton from '../Government equipment schemes/components/VoiceButton';
import { NotificationCategory, NotificationItem } from './types';

export default function NotificationsHub() {
  const { notifications, activeFilter, unreadCount, setFilter } = useNotificationStore();

  const filtered = activeFilter === 'All' 
    ? notifications 
    : notifications.filter((n: NotificationItem) => n.category === activeFilter);

  // Group by date
  const isToday = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isYesterday = (dateStr: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = new Date(dateStr);
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  };

  const groups: Record<string, NotificationItem[]> = {
    'Today': filtered.filter((n: NotificationItem) => isToday(n.timestamp)),
    'Yesterday': filtered.filter((n: NotificationItem) => isYesterday(n.timestamp)),
    'Earlier': filtered.filter((n: NotificationItem) => !isToday(n.timestamp) && !isYesterday(n.timestamp)),
  };

  const criticalAlert = notifications.find((n: NotificationItem) => n.priority === 'critical' && !n.isRead);
  const actionNeededCount = notifications.filter((n: NotificationItem) => !n.isRead && n.priority !== 'info').length;

  const categories: NotificationCategory[] = [
    'All', 'Risk', 'Weather', 'Crop Activities', 'Market', 'Government', 'Insurance', 'Officer Updates'
  ];

  const categoryCounts = categories.reduce((acc: Record<NotificationCategory, number>, cat: NotificationCategory) => {
    acc[cat] = cat === 'All' 
      ? notifications.length 
      : notifications.filter((n: NotificationItem) => n.category === cat).length;
    return acc;
  }, {} as Record<NotificationCategory, number>);

  return (
    <>
      {/* Fixed background image with blur */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-30 blur-[12px] scale-105"
        />
      </div>
      {/* Content shell */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white/90 rounded-[28px] border border-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left rail – filters */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-8">
                <h2 className="text-xl font-bold mb-6 text-[#1A1A1A]">Filters</h2>
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeFilter}
                  categoryCounts={categoryCounts}
                  onSelectCategory={setFilter}
                  variant="sidebar"
                />
              </div>
            </aside>

            {/* Right/main column */}
            <main className="flex-1">
              <NotificationHeader unreadCount={unreadCount()} />
              <div className="flex justify-end mb-4">
                <VoiceButton textToRead="You have new critical alerts and updates." />
              </div>

              <PrioritySummary
                criticalAlert={criticalAlert}
                unreadCount={unreadCount()}
                actionNeededCount={actionNeededCount}
              />

              {/* Mobile filters */}
              <div className="md:hidden mb-6">
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeFilter}
                  categoryCounts={categoryCounts}
                  onSelectCategory={setFilter}
                  variant="sidebar"
                />
              </div>

              <div className="flex flex-col gap-8 pb-24">
                {Object.entries(groups).map(([label, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <TimelineGroup key={label} label={label}>
                      {items.map((notif) => (
                        <NotificationCard key={notif.id} notification={notif} />
                      ))}
                    </TimelineGroup>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No notifications found for this category.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
