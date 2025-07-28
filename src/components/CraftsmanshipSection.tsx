import Image from 'next/image';
import boucleImage from '@/app/boucle.png';

const CraftsmanshipSection = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: Text Content */}
          <div className="md:w-1/2">
            <h2 className="font-headline text-2xl sm:text-3xl text-primary uppercase mb-2">
              FABRIQUE AVEC SOINS
            </h2>
            <div className="w-16 h-0.5 bg-primary mb-8"></div>

            <div className="mb-8">
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-accent-foreground mb-3">
                Haute qualité
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Donec commodo dui at finibus ultricies. Etiam mattis vel arcu id interdum. Phasellus ornare lorem vitae facilisis sodales. Etiam auctor eget turpis eget lacinia. Sed eget augue pretium, lacinia.
              </p>
            </div>

            <div>
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-accent-foreground mb-3">
                Savoir faire-expert
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Donec commodo dui at finibus ultricies. Etiam mattis vel arcu id interdum. Phasellus ornare lorem vitae facilisis sodales. Etiam auctor eget turpis eget lacinia. Sed eget augue pretium, lacinia.
              </p>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-sm h-72 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={boucleImage}
                alt="Boucles d'oreilles fabriquées avec soin"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="earrings jewelry craft"
                className="transition-transform duration-500 group-hover:scale-105"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
