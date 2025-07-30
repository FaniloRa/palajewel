
'use client';

import { Gem } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-primary">
            <Gem className="h-8 w-8 animate-pulse" />
            <span className="text-3xl font-headline tracking-wider uppercase">Pala</span>
        </div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}
