import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ourProductsData } from '@/data/ourProductsData';
import type { OurProduct } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Gem, Facebook, Instagram, Twitter, Gift, Truck, Tag, ShieldCheck } from 'lucide-react';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateStaticParams() {
  return ourProductsData.map((product) => ({
    productId: product.id,
  }));
}

const ProductDetailPage = ({ params }: ProductPageProps) => {
  const product = ourProductsData.find(p => p.id === params.productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <div className="w-full bg-hero-gradient">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumbs (optional enhancement) */}
        {/* 
        <nav className="mb-8 text-sm font-body">
          <Link href="/" className="text-muted-foreground hover:text-primary">Accueil</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link href="/produits" className="text-muted-foreground hover:text-primary">Produits</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        */}

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image Gallery Column */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-xl border border-border">
              <Image 
                src={product.mainImageUrl} 
                alt={product.name} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={`${product.dataAiHint} main`}
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md border border-border">
                <Image 
                  src={product.thumbnailImageUrl1} 
                  alt={`${product.name} vignette 1`} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={`${product.dataAiHint} thumbnail one`}
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md border border-border">
                <Image 
                  src={product.thumbnailImageUrl2} 
                  alt={`${product.name} vignette 2`} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={`${product.dataAiHint} thumbnail two`}
                />
              </div>
            </div>
          </div>

          {/* Product Info Column */}
          <div className="py-4">
            <h1 className="text-3xl lg:text-4xl font-headline text-primary mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-1">RÉF. {product.sku}</p>
            <p className="text-3xl lg:text-4xl font-bold text-foreground mb-6">{product.price.toFixed(2)} €</p>
            
            <div className="prose prose-sm lg:prose-base text-foreground/80 mb-8 font-body">
              <p>{product.detailedDescription || product.description}</p>
            </div>
            
            <Button size="lg" className="w-full mb-8 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base">
              AJOUTER DANS LE PANIER
            </Button>
            
            <div className="space-y-3 font-body">
              <div className="flex items-center text-sm text-foreground/90">
                <Gift size={20} className="mr-3 text-primary shrink-0" />
                <span>C'est un cadeau</span>
              </div>
              <div className="flex items-center text-sm text-foreground/90">
                <Truck size={20} className="mr-3 text-primary shrink-0" />
                <span>Livraison et retours gratuits</span>
              </div>
              <div className="flex items-center text-sm text-foreground/90">
                <Tag size={20} className="mr-3 text-primary shrink-0" />
                <span>Les codes de promotions peuvent être saisis à l'étape suivante</span>
              </div>
              <div className="flex items-center text-sm text-foreground/90">
                <ShieldCheck size={20} className="mr-3 text-primary shrink-0" />
                <span>Paiements sécurisés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section (Placeholder for future enhancement) */}
      {/* <section className="w-full py-12 md:py-16 lg:py-20 bg-accent"> ... </section> */}

      <footer className="w-full py-12 md:py-16 bg-accent text-accent-foreground border-t border-border mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="flex flex-col items-center sm:items-start">
              <Link href="/" className="flex flex-col items-center sm:items-start group mb-4">
                <Gem size={28} className="mb-1 text-primary group-hover:text-primary/80 transition-colors" />
                <span className="font-headline text-3xl tracking-wider text-primary uppercase group-hover:text-primary/80 transition-colors">
                  Pala
                </span>
              </Link>
              <p className="text-sm text-accent-foreground/80 text-center sm:text-left">
                Bijoux d&apos;exception pour chaque occasion. Élégance intemporelle, façonnée avec passion.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-headline text-lg font-semibold text-accent-foreground mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-accent-foreground/80 hover:text-primary">Accueil</Link></li>
                <li><Link href="/shop" className="text-sm text-accent-foreground/80 hover:text-primary">Shop</Link></li>
                <li><Link href="/produits" className="text-sm text-accent-foreground/80 hover:text-primary">Produits</Link></li>
                <li><Link href="/blog" className="text-sm text-accent-foreground/80 hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-headline text-lg font-semibold text-accent-foreground mb-4">Suivez-Nous</h3>
              <div className="flex space-x-4 justify-center sm:justify-start">
                <Link href="#" aria-label="Facebook" className="text-accent-foreground/80 hover:text-primary"><Facebook size={24} /></Link>
                <Link href="#" aria-label="Instagram" className="text-accent-foreground/80 hover:text-primary"><Instagram size={24} /></Link>
                <Link href="#" aria-label="Twitter" className="text-accent-foreground/80 hover:text-primary"><Twitter size={24} /></Link>
              </div>
              <div className="mt-6">
                <h3 className="font-headline text-lg font-semibold text-accent-foreground mb-2">Contactez-Nous</h3>
                <p className="text-sm text-accent-foreground/80">contact@palajewelry.com</p>
                <p className="text-sm text-accent-foreground/80">+261 38 22 224 84</p>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-headline text-lg font-semibold text-accent-foreground mb-4">Restons Connectés</h3>
              <p className="text-sm text-accent-foreground/80 mb-3">
                Abonnez-vous à notre newsletter pour découvrir nos dernières collections et offres exclusives.
              </p>
              <Button variant="default" asChild className="w-full sm:w-auto">
                <Link href="/#newsletter-section">S&apos;abonner</Link>
              </Button>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-accent-foreground/70 font-body">
              &copy; {new Date().getFullYear()} Pala Jewelry. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default ProductDetailPage;
