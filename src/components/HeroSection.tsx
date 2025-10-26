
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/app/hero.png';
import woreImage from '@/app/wore.png';
import { cn } from '@/lib/utils';


interface HeroSectionProps {
    country?: string | null;
    exchangeRate?: number | null;
}

const slides = [
    { src: heroImage, alt: "L'Excellence Intemporelle", dataAiHint: "luxury watch" },
    { src: woreImage, alt: "Savoir-faire artisanal", dataAiHint: "jewelry workshop" }
];


const HeroSection = ({ country, exchangeRate }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col text-accent bg-hero-gradient">
      <Header country={country} exchangeRate={exchangeRate} />
      <div className="flex-grow flex container mx-auto px-4 sm:px-6 lg:px-6 items-start pt-28 md:pt-36 md:gap-8"> {/* Changed items-center to items-start and adjusted padding */}
        {/* Left Content Area */}
        <div className="w-full md:w-1/2 lg:w-1/2 xl:w-2/5 flex flex-col justify-center text-left z-10 animate-fade-in-hero-left">
          <span className="font-snippet font-normal text-sm sm:text-base uppercase tracking-widest text-accent/80 mb-2 sm:mb-3">
            EDITION LIMITEE
          </span>
          <h1 className="font-seoulhangang text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F6D5BE] mb-4 sm:mb-6 leading-tight">
            L'Excellence<br />
            <span className="text-accent">Intemporelle</span>
          </h1>
          <p className="font-kantumruy text-sm sm:text-base text-accent/90 mb-6 sm:mb-8 max-w-md">
            Chaque pièce, fruit d'un savoir-faire centenaire, incarne la
            quintessence de l'horlogerie suisse. Une invitation à posséder
            non pas une montre, mais un héritage.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300 px-6 sm:px-8 py-3 text-xs sm:text-sm"
            >
              DÉCOUVRIR LA COLLECTION
            </Button>
            <Button
              variant="link"
              className="text-accent hover:text-accent/80 px-0 sm:px-4 py-3 group text-xs sm:text-sm"
            >
              PRENDRE RENDEZ-VOUS <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <p className="font-body text-xs text-accent/70 tracking-wider">
            GENEVE | PARIS | MONACO
          </p>
        </div>

        {/* Right Image Area */}
        <div className="hidden md:flex md:w-1/2 lg:w-1/2 xl:w-3/5 h-full items-center justify-center relative z-0 pb-16">
          <div className="relative w-full h-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
            {slides.map((slide, index) => (
              <Image
                key={index}
                src={slide.src}
                alt={slide.alt}
                fill
                style={{ objectFit: 'contain' }}
                quality={90}
                className={cn(
                  'drop-shadow-2xl animate-subtle-float transition-opacity duration-2000 ease-in-out',
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                )}
                priority={index === 0} // Prioritize loading the first image
                data-ai-hint={slide.dataAiHint}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
