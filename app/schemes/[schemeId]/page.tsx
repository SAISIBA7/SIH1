'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useSchemeStore } from '@/Government equipment schemes/store';
import SchemeDetails from '@/Government equipment schemes/SchemeDetails';
import Link from 'next/link';

export default function SchemeDetailPage({
  params,
}: {
  params: Promise<{ schemeId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const schemeId = resolvedParams.schemeId;

  const {
    schemes,
    farmerProfile,
    isSimpleText,
    applyScheme,
    toggleDocumentReady,
  } = useSchemeStore();

  const scheme = schemes.find((s) => s.id === schemeId) || schemes[0];

  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Scheme Not Found</h2>
        <p className="text-gray-500 mb-6">The requested government scheme could not be found.</p>
        <Link
          href="/schemes"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition-all"
        >
          ← Back to All Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <SchemeDetails
        scheme={scheme}
        farmerProfile={farmerProfile}
        isSimpleText={isSimpleText}
        onBack={() => router.push('/schemes')}
        onApply={(id) => applyScheme(id)}
        onToggleDocReady={(sId, docId) => toggleDocumentReady(sId, docId)}
      />
    </div>
  );
}
