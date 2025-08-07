
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
      className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex flex-col md:flex-row items-center gap-10 md:gap-16",
          animationClasses,
          isVisible ? visibleClasses : hiddenClasses
        )}>
          {/* Left: Text Content */}
          <div className="md:w-1/2">
            <h2 className="font-headline text-2xl sm:text-3xl text-primary uppercase mb-2">
              Nos Valeurs
            </h2>
            <div className="w-16 h-0.5 bg-primary mb-8"></div>

            <div className="mb-8">
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-accent-foreground mb-3">
                Engagement et Qualité
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Chaque bijou est le fruit d'un engagement indéfectible envers la qualité. Nous sélectionnons les matériaux les plus nobles et appliquons un contrôle rigoureux à chaque étape de la fabrication pour vous offrir des pièces d'exception.
              </p>
            </div>

            <div>
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-accent-foreground mb-3">
                Confiance et Transparence
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Nous croyons en une relation de confiance avec nos clients. La transparence sur l'origine de nos matériaux et nos processus de création est au cœur de notre démarche pour vous garantir une sérénité totale.
              </p>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 flex justify-center items-center group">
            <div className="relative w-full max-w-sm h-80 rounded-lg overflow-hidden">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Artisan travaillant sur un bijou"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="artisan jewelry workshop"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
