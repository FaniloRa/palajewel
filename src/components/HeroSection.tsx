
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/app/hero.png'; // Importation de l'image locale

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex flex-col text-accent bg-hero-gradient">
      <Header />
      <div className="flex-grow flex container mx-auto px-4 sm:px-6 lg:px-4 items-center pt-24 md:pt-32"> {/* Added padding-top for header */}
        {/* Left Content Area */}
        <div className="w-full md:w-1/2 lg:w-1/2 xl:w-2/5 flex flex-col justify-center text-left pt-8 pb-10 z-10 animate-fade-in-hero-left">
          <span className="font-snippet font-normal text-sm sm:text-base uppercase tracking-widest text-accent/80 mb-2 sm:mb-3">
            EDITION LIMITEE
          </span>
          <h1 className="font-seoulhangang text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F6D5BE] mb-4 sm:mb-6 leading-tight">
            L&apos;Excellence<br />
            <span className="text-accent">Intemporelle</span>
          </h1>
          <p className="font-kantumruy text-sm sm:text-base text-accent/90 mb-6 sm:mb-8 max-w-md">
            Chaque pièce, fruit d&apos;un savoir-faire centenaire, incarne la
            quintessence de l&apos;horlogerie suisse. Une invitation à posséder
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
        <div className="hidden md:flex md:w-1/2 lg:w-1/2 xl:w-3/5 h-full items-center justify-center relative z-0 pb-16"> {/* Adjusted column width and visibility */}
          <div className="relative w-full h-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl"> {/* Increased max-width values */}
            <Image
              src={heroImage}
              alt="L'Excellence Intemporelle"
              layout="fill"
              objectFit="contain"
              quality={90}
              className="drop-shadow-2xl animate-subtle-float"
              priority // Ajout de la propriété priority pour les images LCP
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
