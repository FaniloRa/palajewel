
import HeroSection from '@/components/HeroSection';
import QualitySection from '@/components/QualitySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import StyleComposerSection from '@/components/StyleComposerSection';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import OurProductsSection from '@/components/OurProductsSection';
import StorefrontSection from '@/components/StorefrontSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import type { OurProduct, FeaturedProduct } from '@/types';

export default async function Home() {
  await connectDB();
  
  const ourProducts: OurProduct[] = JSON.parse(JSON.stringify(await Product.find({ status: 'active' }).limit(4).sort({ createdAt: -1 })));
  const featuredProductsDb: OurProduct[] = JSON.parse(JSON.stringify(await Product.find({ featured: true, status: 'active' }).limit(5)));
  
  const featuredProducts: FeaturedProduct[] = featuredProductsDb.map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    viewMoreLink: `/produits/${product.id}`,
    dataAiHint: product.dataAiHint,
  }));


  return (
    <main className="flex flex-col items-center min-h-screen">
      <HeroSection />
      <QualitySection />
      <StyleComposerSection />
      <FeaturedProducts products={featuredProducts} />
      <CraftsmanshipSection />
      <OurProductsSection products={ourProducts} />
      <StorefrontSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
