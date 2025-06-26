
import Header from '@/components/Header';
import JewelryCatalog from '@/components/JewelryCatalog';
import { ourProductsData } from '@/data/ourProductsData';
import Footer from '@/components/Footer';
import CategoryBanner from '@/components/CategoryBanner';
import { cn } from '@/lib/utils';

export default function ShopPage({ searchParams }: { searchParams?: { category?: string } }) {
  const category = searchParams?.category;

  const displayedProducts = category
    ? ourProductsData.filter(p => p.category === category)
    : ourProductsData;

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
