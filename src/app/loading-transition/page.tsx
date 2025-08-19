
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gem } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
      // Redirect to the main dashboard after a short delay
      const timeout = setTimeout(() => {
        router.replace(`/admin?role=${role || 'caissier'}`);
      }, 500); // Wait 500ms before redirecting
      return () => clearTimeout(timeout);
    }
  }, [progress, router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 text-primary">
            <Gem className="h-10 w-10 animate-pulse" />
            <span className="text-4xl font-headline tracking-wider uppercase">Pala</span>
        </div>
        <div className="w-64">
            <Progress value={progress} className="w-full" />
        </div>
        <p className="text-sm text-muted-foreground">Connexion en cours...</p>
      </div>
    </div>
  );
}
