import { Suspense } from 'react';
import ManageFacilitiesPage from '@/Bank Portal/facilities/ManageFacilitiesPage';

export default function ManageFacilitiesAliasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-emerald-800 font-bold">Loading facilities…</div>}>
      <ManageFacilitiesPage />
    </Suspense>
  );
}
