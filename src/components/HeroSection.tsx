import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] md:h-[70vh] text-center">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Featured Jewelry Collection"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="opacity-50"
        data-ai-hint="luxury jewelry"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-30 p-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-accent mb-4 leading-tight shadow-md">
          Discover Timeless Elegance
        </h1>
        <p className="font-body text-lg sm:text-xl text-accent/90 mb-8 max-w-2xl">
          Explore our exquisite collection of handcrafted jewelry, designed to make every moment special.
        </p>
        <Button size="lg" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-300">
          Shop Collection
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
