import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ExcellenceDetails from '@/components/ExcellenceDetails'; // Import du nouveau composant
import { featuredProductsData } from '@/data/featuredProductsData';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <HeroSection />
      <FeaturedProducts products={featuredProductsData} />
      <ExcellenceDetails /> {/* Ajout du nouveau composant ici */}
      <footer className="w-full py-8 text-center border-t border-border mt-auto bg-accent">
        <p className="text-muted-foreground font-body">&copy; {new Date().getFullYear()} Pala Jewelry. All rights reserved.</p>
      </footer>
    </main>
  );
}
