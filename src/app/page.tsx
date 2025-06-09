import HeroSection from '@/components/HeroSection';
import JewelryCatalog from '@/components/JewelryCatalog';
import { mockJewelries } from '@/data/mockJewelry';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background">
      <HeroSection />
      <JewelryCatalog jewelries={mockJewelries} />
      <footer className="w-full py-8 text-center border-t border-border mt-auto">
        <p className="text-muted-foreground font-body">&copy; {new Date().getFullYear()} Pala Jewelry. All rights reserved.</p>
      </footer>
    </main>
  );
}
