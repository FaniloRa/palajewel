

import { headers } from 'next/headers';
import HeroSection from '@/components/HeroSection';
import QualitySection from '@/components/QualitySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import StyleComposerSection from '@/components/StyleComposerSection';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import OurProductsSection from '@/components/OurProductsSection';
import StorefrontSection from '@/components/StorefrontSection';
import ValuesSection from '@/components/ValuesSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { getSetting } from '@/app/actions/settingActions';
import type { OurProduct, FeaturedProduct } from '@/types';

export default async function Home() {
  await connectDB();
  
  // Get user location and currency info to pass to the header
  const country = headers().get('x-vercel-ip-country') || null;
  const rateStr = await getSetting('exchangeRateEuroToMGA');
  const exchangeRate = rateStr ? parseFloat(rateStr) : null;
  
  // By populating the 'category', we ensure the data is complete before serialization.
  // This can prevent issues where unresolved ObjectIds cause BSON errors during stringification.
  const ourProductsDocs = await Product.find({ status: 'active' }).populate('category').limit(4).sort({ createdAt: -1 });
  const featuredProductsDocs = await Product.find({ featured: true, status: 'active' }).populate('category').limit(5);
  
  // JSON.parse(JSON.stringify(...)) is a safe way to deep-clone and serialize Mongoose documents for Next.js Server Components.
  const ourProducts: OurProduct[] = JSON.parse(JSON.stringify(ourProductsDocs));
  const featuredProductsDb: OurProduct[] = JSON.parse(JSON.stringify(featuredProductsDocs));
  
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
      <HeroSection country={country} exchangeRate={exchangeRate} />
      <QualitySection />
      <StyleComposerSection />
      <FeaturedProducts products={featuredProducts} />
      <CraftsmanshipSection />
      {/* The useCurrency hook inside OurProductsSection will now handle conversion autonomously */}
      <OurProductsSection products={ourProducts} />
      <StorefrontSection />
      <ValuesSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
