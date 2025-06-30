
import Header from '@/components/Header';
import JewelryCatalog from '@/components/JewelryCatalog';
import Footer from '@/components/Footer';
import CategoryBanner from '@/components/CategoryBanner';
import { cn } from '@/lib/utils';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import type { OurProduct } from '@/types';

export default async function ShopPage({ searchParams }: { searchParams?: { category?: string } }) {
  const category = searchParams?.category;

  await connectDB();
  
  const filter: { status: 'active', category?: string } = { status: 'active' };
  if (category) {
    filter.category = category;
  }
  const displayedProducts: OurProduct[] = JSON.parse(JSON.stringify(await Product.find(filter).sort({ createdAt: -1 })));

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#F0F4F5]">
      <div className="w-full">
        <Header themeVariant="onLightBg" />
      </div>
      
      <div className={cn(
        "w-full flex-grow",
      )}>
        {category && (
          <div className="pt-24 md:pt-32">
            <CategoryBanner category={category} />
          </div>
        )}
        
        <div className={cn(
          "container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16",
          !category && "pt-24 md:pt-32"
        )}>
          <JewelryCatalog jewelries={displayedProducts} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
