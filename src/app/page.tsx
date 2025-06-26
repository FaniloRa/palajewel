
import HeroSection from '@/components/HeroSection';
import QualitySection from '@/components/QualitySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import StyleComposerSection from '@/components/StyleComposerSection';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import OurProductsSection from '@/components/OurProductsSection';
import StorefrontSection from '@/components/StorefrontSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import { featuredProductsData } from '@/data/featuredProductsData';
import { ourProductsData } from '@/data/ourProductsData';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <HeroSection />
      <QualitySection />
      <StyleComposerSection />
      <FeaturedProducts products={featuredProductsData} />
      <CraftsmanshipSection />
      <OurProductsSection products={ourProductsData} />
      <StorefrontSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
