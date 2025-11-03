

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import hero1 from '@/app/hero1.jpeg';
import hero2 from '@/app/hero2.jpeg';
import hero3 from '@/app/hero3.jpeg';
import heromobile from '@/app/heromobile.jpeg';
import { useIsMobile } from '@/hooks/use-mobile';


interface HeroSectionProps {
    country?: string | null;
    exchangeRate?: number | null;
}

const desktopSlides = [
  { src: hero1, alt: 'Bijoux Pala sur un modèle' },
  { src: hero2, alt: 'Collection de bijoux Pala' },
  { src: hero3, alt: 'Détail d\'un bijou Pala' },
];

const HeroSection = ({ country, exchangeRate }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % desktopSlides.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col text-accent">
       {/* Background Image Carousel / Static Image */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <Image
            src={heromobile}
            alt="Bijoux Pala sur un modèle"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          desktopSlides.map((slide, index) => (
            <Image
              key={index}
              src={slide.src}
              alt={slide.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              className={cn(
                'transition-opacity duration-1000 ease-in-out',
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              )}
              placeholder="blur"
            />
          ))
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      <Header country={country} exchangeRate={exchangeRate} />
      
      <div className="relative z-10 flex-grow flex container mx-auto px-4 sm:px-6 xl:px-8 items-center pt-28 md:pt-36">
        {/* Content Area */}
        <div className="w-full max-w-xl flex flex-col justify-center text-left animate-fade-in-hero-left md:pl-8 lg:pl-16">
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
      </div>
    </section>
  );
};

export default HeroSection;
