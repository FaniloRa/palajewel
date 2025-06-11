import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ExcellenceDetails from '@/components/ExcellenceDetails';
import StyleComposerSection from '@/components/StyleComposerSection';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import OurProductsSection from '@/components/OurProductsSection';
import StorefrontSection from '@/components/StorefrontSection';
import NewsletterSection from '@/components/NewsletterSection';
import { featuredProductsData } from '@/data/featuredProductsData';
import { ourProductsData } from '@/data/ourProductsData';
import Link from 'next/link';
import { Gem, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <HeroSection />
      <FeaturedProducts products={featuredProductsData} />
      <ExcellenceDetails />
      <StyleComposerSection />
      <CraftsmanshipSection />
      <OurProductsSection products={ourProductsData} />
      <StorefrontSection />
      <NewsletterSection />
      <footer className="w-full py-12 md:py-16 bg-accent text-accent-foreground border-t border-border mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Column 1: Brand/Logo */}
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

            {/* Column 2: Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="font-headline text-lg font-semibold text-accent-foreground mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><Link href="/accueil" className="text-sm text-accent-foreground/80 hover:text-primary">Accueil</Link></li>
                <li><Link href="/shop" className="text-sm text-accent-foreground/80 hover:text-primary">Shop</Link></li>
                <li><Link href="/produits" className="text-sm text-accent-foreground/80 hover:text-primary">Produits</Link></li>
                <li><Link href="/blog" className="text-sm text-accent-foreground/80 hover:text-primary">Blog</Link></li>
              </ul>
            </div>

            {/* Column 3: Follow Us & Contact */}
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

            {/* Column 4: Newsletter Reminder */}
            <div className="text-center sm:text-left">
              <h3 className="font-headline text-lg font-semibold text-accent-foreground mb-4">Restons Connectés</h3>
              <p className="text-sm text-accent-foreground/80 mb-3">
                Abonnez-vous à notre newsletter pour découvrir nos dernières collections et offres exclusives.
              </p>
              <Button variant="default" asChild className="w-full sm:w-auto">
                <Link href="#newsletter-section">S&apos;abonner</Link>
              </Button>
            </div>
          </div>

          {/* Bottom Bar: Copyright */}
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-accent-foreground/70 font-body">
              &copy; {new Date().getFullYear()} Pala Jewelry. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
