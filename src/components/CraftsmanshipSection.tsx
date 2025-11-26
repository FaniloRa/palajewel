
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import backsect2 from '@/app/backsect4.png';

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
      className="w-full bg-background flex items-center px-4 py-4"
    >
      <div className={cn(
          "relative w-full h-[85vh] md:h-[90vh] transition-opacity duration-1000 ease-out shadow-xl",
          isVisible ? 'opacity-100' : 'opacity-0'
      )}>
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
        </div>
        <div
          className={cn(
            'relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-start items-center h-full transition-all duration-1000 ease-out',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          )}
        >
          <div className="w-full md:w-2/3 lg:w-3/5 p-8 rounded-lg space-y-8">
            <p className="font-body text-base md:text-lg text-black leading-relaxed">
              Au cœur de notre atelier, des artisans passionnés allient
              techniques traditionnelles et innovation. Chaque pierre est
              sertie à la main, chaque courbe est polie avec une infinie
              patience. Ce dévouement donne vie à des pièces uniques, où
              chaque détail témoigne d'un art maîtrisé.
            </p>
            <div className="text-black leading-relaxed">
              <p className="font-body text-base md:text-lg">
                  Chaque création PALA est le fruit d'un savoir-faire joaillier d'exception, façonnée pour sublimer la lumière et l'âme de celle ou celui qui la porte.
              </p>
              <p className="font-body text-base md:text-lg mt-4">
                  Plus qu'un bijou, c'est une œuvre intemporelle, symbole d'élégance et d'héritage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
