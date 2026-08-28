import { create } from 'zustand';
import { NotificationItem, NotificationCategory } from './types';
import { mockNotifications } from './data/notifications.mock';

interface NotificationState {
  notifications: NotificationItem[];
  activeFilter: NotificationCategory;
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setFilter: (category: NotificationCategory) => void;
}

export const useNotificationStore = create<NotificationState>((set: any, get: any) => ({
  notifications: mockNotifications,
  activeFilter: 'All',
  
  unreadCount: () => get().notifications.filter((n: NotificationItem) => !n.isRead).length,
  
  markAsRead: (id: string) =>
    set((state: NotificationState) => ({
      notifications: state.notifications.map((n: NotificationItem) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
    
  markAllAsRead: () =>
    set((state: NotificationState) => ({
      notifications: state.notifications.map((n: NotificationItem) => ({ ...n, isRead: true })),
    })),
    
  setFilter: (category: NotificationCategory) => set({ activeFilter: category }),
}));
