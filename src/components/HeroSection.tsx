import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex flex-col text-accent bg-background">
      <Header />
      <div className="flex-grow flex container mx-auto px-4 sm:px-6 lg:px-8 items-center pt-24 md:pt-32"> {/* Added padding-top for header */}
        {/* Left Content Area */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex flex-col justify-center text-left py-10 z-10">
          <span className="font-body text-xs sm:text-sm uppercase tracking-widest text-accent/80 mb-2 sm:mb-3">
            EDITION LIMITEE
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-accent mb-4 sm:mb-6 leading-tight">
            L&apos;Excellence<br />Intemporelle
          </h1>
          <p className="font-body text-sm sm:text-base text-accent/90 mb-6 sm:mb-8 max-w-md">
            Chaque pièce, fruit d&apos;un savoir-faire centenaire, incarne la
            quintessence de l&apos;horlogerie suisse. Une invitation à posséder
            non pas une montre, mais un héritage.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300 px-6 sm:px-8 py-3 text-xs sm:text-sm"
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
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 h-full items-center justify-center relative z-0 pb-16"> {/* Added padding-bottom to align with text baseline */}
          <div className="relative w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <Image
              src="https://placehold.co/600x800.png" // Placeholder for the watch
              alt="L'Excellence Intemporelle Watch"
              layout="fill"
              objectFit="contain"
              quality={90}
              className="drop-shadow-2xl"
              data-ai-hint="luxury watch gold"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
