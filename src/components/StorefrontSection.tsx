import Image from 'next/image';
import { Gem, MapPin, Phone, Mail } from 'lucide-react';

const StorefrontSection = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
          Explorez notre collection exclusive
        </h2>
        <div className="flex justify-center mb-1">
            <div className="w-24 h-0.5 bg-primary/50"></div>
        </div>
        <p className="font-body text-base text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto">
          Découvrez des créations uniques et laissez-vous séduire par l&apos;élégance de nos bijoux faits à la main.
        </p>

        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-xl group">
          <Image
            src="https://placehold.co/1200x800.png"
            alt="Intérieur de la boutique Pala Jewelry"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="jewelry store interior"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md p-6 bg-primary/90 backdrop-blur-sm rounded-lg shadow-2xl text-primary-foreground">
            <div className="flex flex-col items-center mb-4">
              <Gem size={28} className="mb-1.5 text-accent" />
              <p className="font-headline text-3xl tracking-wider uppercase text-accent">
                PALA
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 shrink-0 text-accent" />
                <span>10 Rue Ratsimilaho, Antananarivo, Madagascar, 101</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 shrink-0 text-accent" />
                <span>+261 38 22 224 84</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 shrink-0 text-accent" />
                <span>contact@palajewelry.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorefrontSection;
