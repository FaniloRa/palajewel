
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import woreImage from '@/app/wore.png';
import Link from 'next/link';

const CraftsmanshipSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[60vh] md:h-[70vh] bg-background flex items-center justify-center text-center"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={woreImage}
          alt="Atelier de joaillerie Pala"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="jewelry workshop"
          placeholder="blur"
        />
         <div className="absolute inset-0 bg-black/40" />
      </div>
      <div
        className={cn(
          'relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-white transition-all duration-1000 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        <h2 className="font-headline text-3xl md:text-5xl font-bold uppercase tracking-wider mb-4">
          L'Art de l'Artisanat
        </h2>
        <p className="font-body text-base md:text-lg max-w-2xl mx-auto mb-8">
          Chaque bijou est le fruit d'un savoir-faire d'exception. Nos artisans joailliers façonnent à la main des pièces uniques, alliant techniques ancestrales et design contemporain pour donner vie à des créations intemporelles.
        </p>
        <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary transition-colors duration-300">
            <Link href="/about">En savoir plus</Link>
        </Button>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
