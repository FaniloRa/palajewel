
'use client';

import Image from 'next/image';
import logo2 from '@/app/logo2.png';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center text-primary">
           <Image
              src={logo2}
              alt="Pala Jewelry Logo"
              width={180}
              height={90}
              className="animate-pulse"
              priority
            />
        </div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}
