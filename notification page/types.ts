export type NotificationCategory =
  | 'Risk'
  | 'Weather'
  | 'Crop Activities'
  | 'Market'
  | 'Government'
  | 'Insurance'
  | 'Officer Updates'
  | 'All';

export type PriorityLevel = 'critical' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  priority: PriorityLevel;
  title: string;
  description: string;
  timestamp: string; // ISO string
  ctaLabel: string;
  ctaHref: string;
  isRead: boolean;
}
