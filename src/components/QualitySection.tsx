
import Image from 'next/image';
import collierImage from '@/app/collier.png'; // Importation de la nouvelle image

const QualitySection = () => {
  return (
    <section className="w-full bg-accent text-accent-foreground pt-0 pb-12 md:pb-16 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Text Block */}
          <div className="md:w-1/3 text-center md:text-left">
            <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4">
              Haute qualité
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Donec commodo dui at finibus ultricies. Etiam mattis vel arcu id interdum. Phasellus ornare lorem vitae facilisis sodales. Etiam auctor eget turpis eget lacinia. Sed eget augue pretium, lacinia.
            </p>
          </div>

          {/* Center Image Block */}
          <div className="md:w-auto flex justify-center items-center my-8 md:my-0 max-w-xs md:max-w-sm">
            <div className="relative w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-96"> {/* Adjusted for a pendant-like shape and made larger */}
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
          <div className="md:w-1/3 text-center md:text-left">
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
