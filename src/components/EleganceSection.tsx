'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import watchImage from '@/app/montre.jpg';
import backgroundImage from '@/app/backsect2.png';

const EleganceSection = () => {
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
      className="relative w-full bg-background py-12 md:py-16 lg:py-20"
    >
        <Image
          src={backgroundImage}
          alt="Fond abstrait"
          fill
          style={{ objectFit: 'cover' }}
          className="-z-10 opacity-30"
          data-ai-hint="abstract texture"
        />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image on the left */}
          <div
            className={cn(
              'relative w-full h-80 md:h-full min-h-[400px] transition-all duration-1000 ease-out',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            )}
          >
            <Image
              src={watchImage}
              alt="Montre PALA élégante"
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint="watch diamonds elegant"
              className="rounded-lg shadow-xl"
            />
          </div>

          {/* Text on the right */}
          <div
            className={cn(
              'space-y-6 transition-all duration-1000 ease-out',
              isVisible ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 translate-x-10'
            )}
          >
            <div className="space-y-3">
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Évoquant la douceur d'un moment suspendu, cette montre
                capture la lumière comme un bijou précieux. Son cadran
                délicat, inspiré des nuits étoilées, reflète une élégance discrète
                tandis que son boîtier finement poli raconte un savoir-faire
                maîtrisé. Chaque détail semble murmurer une histoire, une
                émotion, une présence.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Pensée pour la femme qui avance avec assurance et finesse,
                elle se porte comme une signature personnelle. Son bracelet
                se pose sur le poignet avec la grâce d'un bijou rare,
                transformant chaque regard en éclat de rêve. Plus qu'une
                montre, c'est une complice intime : un symbole d'élégance
                intemporelle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EleganceSection;
