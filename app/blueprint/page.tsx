'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import BlueprintEditor from '@/components/blueprint/BlueprintEditor';

export default function BlueprintPage() {
  const { isAdmin, mode } = useMode();
  const router = useRouter();

  useEffect(() => {
    if (mode !== 'locked' && !isAdmin) {
      router.replace('/today');
    }
  }, [mode, isAdmin, router]);

  if (mode === 'locked' || !isAdmin) {
    return null;
  }

  return (
    <div className="py-6 animate-fade-in">
      <BlueprintEditor />
    </div>
  );
}
