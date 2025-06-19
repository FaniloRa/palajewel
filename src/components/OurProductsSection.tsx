import Image from 'next/image';
import type { OurProduct } from '@/types';
import Link from 'next/link';

interface OurProductsSectionProps {
  products: OurProduct[];
}

const OurProductsSection: React.FC<OurProductsSectionProps> = ({ products }) => {
  return (
    <section id="nos-produits-section" className="w-full py-12 md:py-16 lg:py-20 bg-[#F0F4F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-nunito-sans text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-3">
          Nos Produits
        </h2>
        <div className="flex justify-center mb-1">
            <div className="w-20 h-0.5 bg-primary/50"></div>
        </div>
        <div className="flex justify-center mb-6">
            <div className="w-16 h-0.5 bg-primary/50"></div>
        </div>
        <p className="font-body text-sm text-slate-700 mb-10 md:mb-12 max-w-2xl mx-auto">
          Découvrez des créations uniques et laissez-vous séduire par l&apos;élégance de nos bijoux faits à la main.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <Link key={product.id} href={`/produits/${product.id}`} className="group">
              <div className="flex flex-col items-center text-slate-800 h-full">
                <div className="relative w-full h-64 md:h-72 mb-4 overflow-hidden rounded-md shadow-lg bg-white">
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={product.dataAiHint}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-headline text-lg font-medium mb-1">{product.name}</h3>
                <p className="font-body text-xs text-slate-600 mb-1">{product.description}</p>
                <p className="font-body text-base font-semibold text-primary mt-auto">{product.price.toFixed(2)} €</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProductsSection;
