
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const ValuesSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target); // Animate only once
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
            observer.unobserve(sectionRef.current);
        }
        };
    }, []);

    const animationClasses = "transition-all duration-1000 ease-out";
    const hiddenClasses = "opacity-0 translate-y-8";
    const visibleClasses = "opacity-100 translate-y-0";

  return (
    <section 
      ref={sectionRef}
      className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "relative w-full h-[500px] md:h-[550px] rounded-lg overflow-hidden shadow-xl group flex items-center",
          animationClasses,
          isVisible ? visibleClasses : hiddenClasses
        )}>
          <Image
            src="https://placehold.co/1200x800.png"
            alt="Artisan travaillant sur un bijou avec passion"
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="artisan jewelry workshop"
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          
          {/* Text Content */}
          <div className="relative z-10 p-8 md:p-12 md:w-1/2 lg:w-2/3 text-white">
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase mb-2">
              Nos Valeurs
            </h2>
            <div className="w-20 h-0.5 bg-white mb-8"></div>

            <div className="mb-8">
              <h3 className="font-headline text-2xl sm:text-3xl font-semibold text-white mb-3">
                Engagement et Qualité
              </h3>
              <p className="font-body text-base text-white/90 leading-relaxed max-w-lg">
                Chaque bijou est le fruit d'un engagement indéfectible envers la qualité. Nous sélectionnons les matériaux les plus nobles et appliquons un contrôle rigoureux à chaque étape de la fabrication pour vous offrir des pièces d'exception.
              </p>
            </div>

            <div>
              <h3 className="font-headline text-2xl sm:text-3xl font-semibold text-white mb-3">
                Confiance et Transparence
              </h3>
              <p className="font-body text-base text-white/90 leading-relaxed max-w-lg">
                Nous croyons en une relation de confiance avec nos clients. La transparence sur l'origine de nos matériaux et nos processus de création est au cœur de notre démarche pour vous garantir une sérénité totale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
