
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import boucleImage from '@/app/boucle2.png';
import woreImage from '@/app/backgroundart.png'; // Import the new background image
import { cn } from '@/lib/utils';

const CraftsmanshipSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animationClasses = "transition-all duration-700 ease-out";
  const hiddenClasses = "opacity-0 translate-y-8";
  const visibleClasses = "opacity-100 translate-y-0";

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-12 md:py-16 lg:py-20 text-foreground overflow-hidden"
    >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <Image
                src={woreImage}
                alt="Artisanat de bijoux"
                fill
                style={{ objectFit: 'contain' }}
                className="transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
            />
        </div>


      <div className={cn(
          "relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-16",
          animationClasses,
          isVisible ? visibleClasses : hiddenClasses
        )}>
          {/* Left: Image */}
          <div className="md:w-1/2 flex justify-center items-center group">
            <div className="relative w-full max-w-sm h-80 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={boucleImage}
                alt="Boucles d'oreilles fabriquées avec soin"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="earrings jewelry craft"
                className="transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
              />
            </div>
          </div>
          
          {/* Right: Text Content */}
          <div className="md:w-1/2">
            <h2 className="font-headline text-2xl sm:text-3xl text-primary uppercase mb-2">
              Artisanat d'Exception
            </h2>
            <div className="w-16 h-0.5 bg-primary mb-8"></div>

            <div className="mb-8">
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-primary mb-3">
                Des Matériaux Précieux
              </h3>
              <p className="font-body text-sm text-foreground/80 leading-relaxed">
                Chaque bijou Pala est façonné à partir de matériaux nobles, sélectionnés pour leur pureté et leur éclat durable. Nous travaillons l'or, l'argent et les pierres précieuses avec le plus grand respect pour leur beauté naturelle.
              </p>
            </div>

            <div>
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-primary mb-3">
                L'Art de l'Artisan
              </h3>
              <p className="font-body text-sm text-foreground/80 leading-relaxed">
                Nos artisans joailliers, maîtres dans leur domaine, allient techniques ancestrales et précision moderne. Chaque détail est pensé, chaque courbe polie à la main pour donner naissance à une pièce véritablement unique.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
};

export default CraftsmanshipSection;
