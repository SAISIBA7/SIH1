export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import BankDashboardPage from '@/Bank Portal/dashboard/BankDashboardPage';

export const metadata = {
  title: 'Bank Dashboard | Smart Crop Partner Portal',
  description: 'Manage bank profile, loan facilities, and farmer applications.',
};

export default function DashboardRoute() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>}>
      <BankDashboardPage />
    </Suspense>
  );
}
