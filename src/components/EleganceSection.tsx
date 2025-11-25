'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import montreImage from '@/app/montre.jpg';
import voileImage from '@/app/backsect2.png';

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
      { threshold: 0.1 }
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
      className="relative w-full py-16 md:py-24 bg-background overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src={voileImage}
          alt="Voile de fond"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="fabric texture"
          placeholder="blur"
        />
      </div>
      <div
        className={cn(
          'relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative w-full aspect-square md:aspect-[4/5] rounded-lg overflow-hidden shadow-xl group">
            <Image
              src={montreImage}
              alt="Montre PALA élégante"
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint="watch fashion model"
              className="transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="text-foreground/80 font-body text-base md:text-lg leading-relaxed text-justify">
            <p className="mb-6">
              Évoquant la douceur d’un moment suspendu, cette montre
              capture la lumière comme un bijou précieux. Son cadran
              délicat, inspiré des nuits étoilées, reflète une élégance discrète
              tandis que son boîtier finement poli raconte un savoir-faire
              maîtrisé. Chaque détail semble murmurer une histoire, une
              émotion, une présence.
            </p>
            <p>
              Pensée pour la femme qui avance avec assurance et finesse,
              elle se porte comme une signature personnelle. Son bracelet
              se pose sur le poignet avec la grâce d’un bijou rare,
              transformant chaque regard en éclat de rêve. Plus qu’une
              montre, c’est une complice intime : un symbole d’élégance
              intemporelle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EleganceSection;
