
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import anneauxImageFromFile from '@/app/anneaux.jpg';
import montreImageFromFile from '@/app/montre.jpg';
import accessoiresImageFromFile from '@/app/alef.jpg';
import { cn } from '@/lib/utils';

interface StyleCardItem {
  id: string;
  title: string;
  imageUrl: string | any;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
  logoTextLine1: string;
  logoTextLine2?: string;
  dataAiHint: string;
}

const styleCardsData: StyleCardItem[] = [
  {
    id: 'style-anneaux',
    title: 'Anneaux',
    imageUrl: anneauxImageFromFile,
    imageAlt: 'Modèle portant des anneaux PALA',
    buttonText: 'Découvrir maintenant',
    buttonLink: '/collections/anneaux',
    logoTextLine1: 'PALA',
    logoTextLine2: 'Créateur Joaillier',
    dataAiHint: 'rings jewelry model',
  },
  {
    id: 'style-montre',
    title: 'Montre',
    imageUrl: montreImageFromFile,
    imageAlt: 'Montre PALA au poignet',
    buttonText: 'Découvrir maintenant',
    buttonLink: '/collections/montres',
    logoTextLine1: 'PALA',
    logoTextLine2: 'DEPUIS 1922',
    dataAiHint: 'watch fashion model',
  },
  {
    id: 'style-accessoires',
    title: 'Accessoires',
    imageUrl: accessoiresImageFromFile,
    imageAlt: 'Modèle portant des accessoires PALA',
    buttonText: 'Découvrir maintenant',
    buttonLink: '/collections/accessoires',
    logoTextLine1: 'PALA',
    logoTextLine2: 'Créateur Joaillier',
    dataAiHint: 'accessories jewelry model',
  },
];

const StyleComposerSection = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(styleCardsData.length).fill(false)
  );

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[], observerInstance: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cardIndex = cardRefs.current.findIndex(ref => ref === entry.target);
          if (cardIndex !== -1) {
            setVisibleCards(prev => {
              const newVisible = [...prev];
              newVisible[cardIndex] = true;
              return newVisible;
            });
            observerInstance.unobserve(entry.target); // Unobserve after animation
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);


  const getDelayClass = (index: number): string => {
    if (index === 0) return 'delay-0';
    if (index === 1) return 'md:delay-200';
    if (index === 2) return 'md:delay-400';
    return '';
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-body text-sm text-muted-foreground mb-2">
          Tous les détails
        </p>
        <h2 className="font-nunito-sans text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-10 md:mb-12">
          Composer votre style
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {styleCardsData.map((card, index) => (
            <div 
              key={card.id} 
              ref={el => cardRefs.current[index] = el}
              className={cn(
                "relative group h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-xl",
                "transition-all duration-700 ease-out",
                getDelayClass(index),
                visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <Image
                src={card.imageUrl}
                alt={card.imageAlt}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={card.dataAiHint}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <h3 className="font-headline text-4xl lg:text-5xl font-bold mb-6">
                  {card.title}
                </h3>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 border-white text-white backdrop-blur-sm transition-all duration-300 px-8 py-3 group-hover:px-10"
                  asChild
                >
                  <Link href={card.buttonLink}>{card.buttonText}</Link>
                </Button>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center text-white/90">
                <Gem size={18} className="mb-1" />
                <p className="font-headline text-lg tracking-wider uppercase">{card.logoTextLine1}</p>
                {card.logoTextLine2 && (
                  <p className="font-body text-xs tracking-widest">{card.logoTextLine2}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleComposerSection;
