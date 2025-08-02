'use client';

import Image from 'next/image';
import collierImage from '@/app/collier.png';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const QualitySection = () => {
  const [isVisibleLeft, setIsVisibleLeft] = useState(false);
  const [isVisibleRight, setIsVisibleRight] = useState(false);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === leftTextRef.current) {
            setIsVisibleLeft(entry.isIntersecting);
        } else if (entry.target === rightTextRef.current) {
            setIsVisibleRight(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (leftTextRef.current) {
      observer.observe(leftTextRef.current);
    }
    if (rightTextRef.current) {
      observer.observe(rightTextRef.current);
    }

    return () => {
      if (leftTextRef.current) {
        observer.unobserve(leftTextRef.current);
      }
      if (rightTextRef.current) {
        observer.unobserve(rightTextRef.current);
      }
    };
  }, []);

  const textBlockBaseClasses = "transition-all duration-700 ease-out";
  const textBlockHiddenClasses = "opacity-0 translate-y-8";
  const textBlockVisibleClasses = "opacity-100 translate-y-0";

  return (
    <section className="w-full bg-background text-foreground pt-0 pb-4 md:pb-4 lg:pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Text Block */}
          <div
            ref={leftTextRef}
            className={`md:w-1/3 text-center md:text-left ${textBlockBaseClasses} ${isVisibleLeft ? textBlockVisibleClasses : textBlockHiddenClasses}`}
          >
            <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4">
              Haute qualité
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Chaque création PALA est une promesse d'excellence. Nous sélectionnons rigoureusement des matériaux nobles, de l'or 18 carats aux diamants certifiés, pour garantir une pureté et une brillance incomparables. Nos bijoux sont conçus pour traverser le temps, comme un héritage précieux.
            </p>
          </div>

          {/* Center Image Block */}
          <div className="md:w-auto flex justify-center items-center my-8 md:my-0 max-w-xs md:max-w-sm">
            <div className="relative w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-96">
              <Image
                src={collierImage}
                alt="Collier PALA de haute qualité en or et diamants"
                fill
                style={{ objectFit: 'contain' }}
                data-ai-hint="gold diamond necklace"
                priority
              />
            </div>
          </div>

          {/* Right Text Block */}
          <div
            ref={rightTextRef}
            className={`md:w-1/3 text-center md:text-left ${textBlockBaseClasses} ${isVisibleRight ? textBlockVisibleClasses : textBlockHiddenClasses} md:delay-200`} // Optional: add a slight delay for the second block
          >
            <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4">
              Savoir faire-expert
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Au cœur de notre atelier, des artisans passionnés allient techniques traditionnelles et innovation. Chaque pierre est sertie à la main, chaque courbe est polie avec une infinie patience. Ce dévouement donne vie à des pièces uniques, où chaque détail témoigne d'un art maîtrisé.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
