'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import SchemeHub from "@/Government equipment schemes/index";
import { useSchemeStore } from "@/Government equipment schemes/store";

export default function SchemeDetailsPage() {
  const params = useParams();
  const schemeId = params?.schemeId as string;
  const setSelectedScheme = useSchemeStore((state) => state.setSelectedScheme);

  useEffect(() => {
    if (schemeId) {
      setSelectedScheme(schemeId);
    }
  }, [schemeId, setSelectedScheme]);

  return <SchemeHub />;
}
