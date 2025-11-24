
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import backsect2 from '@/app/backsect2.png';

const PromiseSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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
      className="relative w-full h-[60vh] md:h-[70vh] bg-background flex items-center"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={backsect2}
          alt="Collier PALA sur un drap en soie"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="necklace silk"
          priority
          placeholder="blur"
        />
         <div className="absolute inset-0 bg-black/20" />
      </div>
      <div
        className={cn(
          'relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-end transition-all duration-1000 ease-out',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
        )}
      >
        <div className="w-full md:w-1/2 lg:w-2/5 bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <p className="font-body text-base md:text-lg text-black leading-relaxed text-justify">
            Chaque création PALA est une promesse d'excellence.
            Nous sélectionnons rigoureusement des matériaux
            nobles, de l'or 18 carats aux diamants certifiés, pour
            garantir une pureté et une brillance incomparables.
            Nos bijoux sont conçus pour traverser le temps,
            comme un héritage précieux.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromiseSection;
