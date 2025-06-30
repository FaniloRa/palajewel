import Image from 'next/image';
import Link from 'next/link';
import type { FeaturedProduct } from '@/types';

interface FeaturedProductsProps {
  products: FeaturedProduct[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <section className="w-full md:pt-10 lg:pt-12 pb-12 md:pb-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-nunito-sans text-sm text-muted-foreground mb-2">
          Découvrez l&apos;essence du raffinement et du style intemporel
        </p>
        <h2 className="font-nunito-sans text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-10 md:mb-12">
          Explorer l&apos;univers PALA
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center group">
              <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4 rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={product.dataAiHint}
                />
              </div>
              <h3 className="font-nunito-sans text-xl text-accent-foreground mb-1">{product.name}</h3>
              <Link href={product.viewMoreLink} className="font-nunito-sans text-xs text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">
                  Voir plus
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
