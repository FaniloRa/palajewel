import HeroSection from '@/components/HeroSection';
import JewelryCatalog from '@/components/JewelryCatalog';
import FeaturedProducts from '@/components/FeaturedProducts'; // Added import
import { mockJewelries } from '@/data/mockJewelry';
import { featuredProductsData } from '@/data/featuredProductsData'; // Added import

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background">
      <HeroSection />
      <FeaturedProducts products={featuredProductsData} /> {/* Added new section */}
      <JewelryCatalog jewelries={mockJewelries} />
      <footer className="w-full py-8 text-center border-t border-border mt-auto">
        <p className="text-muted-foreground font-body">&copy; {new Date().getFullYear()} Pala Jewelry. All rights reserved.</p>
      </footer>
    </main>
  );
}
