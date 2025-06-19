'use client';

import Image from 'next/image';
import collierImage from '@/app/collier.png';
import { useState, useEffect, useRef } from 'react';

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
        if (entry.isIntersecting) {
          if (entry.target === leftTextRef.current) {
            setIsVisibleLeft(true);
          } else if (entry.target === rightTextRef.current) {
            setIsVisibleRight(true);
          }
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
    <section className="w-full bg-accent text-accent-foreground pt-0 pb-4 md:pb-4 lg:pb-4">
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
              Donec commodo dui at finibus ultricies. Etiam mattis vel arcu id interdum. Phasellus ornare lorem vitae facilisis sodales. Etiam auctor eget turpis eget lacinia. Sed eget augue pretium, lacinia.
            </p>
          </div>

          {/* Center Image Block */}
          <div className="md:w-auto flex justify-center items-center my-8 md:my-0 max-w-xs md:max-w-sm">
            <div className="relative w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-96">
              <Image
                src={collierImage}
                alt="Collier PALA de haute qualité en or et diamants"
                layout="fill"
                objectFit="contain"
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
              Donec commodo dui at finibus ultricies. Etiam mattis vel arcu id interdum. Phasellus ornare lorem vitae facilisis sodales. Etiam auctor eget turpis eget lacinia. Sed eget augue pretium, lacinia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
