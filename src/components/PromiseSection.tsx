
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import backsect2 from '@/app/backsect2.png';

const PromiseSection = () => {
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
      className="w-full bg-background pt-10"
    >
        <div className={cn(
            'relative h-[70vh] md:h-[80vh] flex items-center shadow-xl transition-opacity duration-1000 ease-out',
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
                'relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-end transition-transform duration-1000 ease-out',
                isVisible ? 'translate-x-0' : 'translate-x-10'
                )}
            >
                <div className="w-full md:w-1/2 lg:w-2/5 p-8 rounded-lg">
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
      </div>
    </section>
  );
};

export default PromiseSection;
