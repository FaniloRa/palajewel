
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import logo2 from '@/app/logo2.png';

export default function LoadingTransitionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Simulate loading time and update progress bar
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 15;
      });
    }, 400); // Update every 400ms

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const role = searchParams.get('role');
      // This page is currently only used for admin redirection,
      // but the logo change is applied as requested.
      // If used for client-side transitions, the redirect logic might need adjustment.
      const timeout = setTimeout(() => {
        router.replace(`/admin?role=${role || 'caissier'}`);
      }, 500); // Wait 500ms before redirecting
      return () => clearTimeout(timeout);
    }
  }, [progress, router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center text-primary-foreground">
            <Image
              src={logo2}
              alt="Pala Jewelry Logo"
              width={180}
              height={90}
              className="animate-pulse"
              priority
            />
        </div>
        <div className="w-64">
            <Progress 
              value={progress} 
              className="w-full h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground" 
            />
        </div>
        <p className="text-sm text-primary-foreground/70">Chargement en cours...</p>
      </div>
    </div>
  );
}
