import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ExcellenceDetails from '@/components/ExcellenceDetails';
import StyleComposerSection from '@/components/StyleComposerSection';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import OurProductsSection from '@/components/OurProductsSection'; // Nouvelle importation
import { featuredProductsData } from '@/data/featuredProductsData';
import { ourProductsData } from '@/data/ourProductsData'; // Nouvelle importation

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <HeroSection />
      <FeaturedProducts products={featuredProductsData} />
      <ExcellenceDetails />
      <StyleComposerSection />
      <CraftsmanshipSection />
      <OurProductsSection products={ourProductsData} /> {/* Nouveau composant ajouté */}
      <footer className="w-full py-8 text-center border-t border-border mt-auto bg-accent">
        <p className="text-muted-foreground font-body">&copy; {new Date().getFullYear()} Pala Jewelry. All rights reserved.</p>
      </footer>
    </main>
  );
}
