import Image from 'next/image';
import boucleImage from '@/app/boucle2.png';

const CraftsmanshipSection = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: Text Content */}
          <div className="md:w-1/2">
            <h2 className="font-headline text-2xl sm:text-3xl text-primary uppercase mb-2">
              Artisanat d'Exception
            </h2>
            <div className="w-16 h-0.5 bg-primary mb-8"></div>

            <div className="mb-8">
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-accent-foreground mb-3">
                Des Matériaux Précieux
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Chaque bijou Pala est façonné à partir de matériaux nobles, sélectionnés pour leur pureté et leur éclat durable. Nous travaillons l'or, l'argent et les pierres précieuses avec le plus grand respect pour leur beauté naturelle.
              </p>
            </div>

            <div>
              <h3 className="font-headline text-xl sm:text-2xl font-semibold text-accent-foreground mb-3">
                L'Art de l'Artisan
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Nos artisans joailliers, maîtres dans leur domaine, allient techniques ancestrales et précision moderne. Chaque détail est pensé, chaque courbe polie à la main pour donner naissance à une pièce véritablement unique.
              </p>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-sm h-80 rounded-lg overflow-hidden">
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
