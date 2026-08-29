import { create } from 'zustand';
import { NotificationItem, NotificationCategory } from './types';
import { mockNotifications } from './data/notifications.mock';

interface NotificationSummary {
  unreadCount: number;
  actionNeededCount: number;
  topCriticalAlert: NotificationItem | null;
}

interface NotificationState {
  notifications: NotificationItem[];
  activeFilter: NotificationCategory;
  loading: boolean;
  summary: NotificationSummary;
  fetchNotifications: (category?: NotificationCategory) => Promise<void>;
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setFilter: (category: NotificationCategory) => void;
}

export const useNotificationStore = create<NotificationState>((set: any, get: any) => ({
  notifications: mockNotifications, // Fallback to mock data if API fails
  activeFilter: 'All',
  loading: false,
  summary: {
    unreadCount: 0,
    actionNeededCount: 0,
    topCriticalAlert: null,
  },

  fetchNotifications: async (category?: NotificationCategory) => {
    set({ loading: true });
    try {
      const cat = category && category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
      const res = await fetch(`/api/notifications?farmerId=FRM_47166869_622${cat}`);
      const json = await res.json();
      
      if (json.success && json.data?.notifications?.length > 0) {
        set({
          notifications: json.data.notifications,
          summary: json.data.summary,
          loading: false,
        });
      } else {
        // Keep mock data as fallback
        set({ loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ loading: false });
    }
  },

  unreadCount: () => get().notifications.filter((n: NotificationItem) => !n.isRead).length,

  markAsRead: async (id: string) => {
    // Optimistic update
    set((state: NotificationState) => ({
      notifications: state.notifications.map((n: NotificationItem) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
    // Persist to RDS
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (e) {
      console.error('Failed to mark as read:', e);
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state: NotificationState) => ({
      notifications: state.notifications.map((n: NotificationItem) => ({ ...n, isRead: true })),
    }));
    // Persist to RDS
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: 'FRM_47166869_622' }),
      });
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  },

  setFilter: (category: NotificationCategory) => {
    set({ activeFilter: category });
    // Re-fetch with new filter
    get().fetchNotifications(category);
  },
}));
