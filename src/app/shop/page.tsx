

import mongoose from 'mongoose';
import { headers } from 'next/headers';
import Header from '@/components/Header';
import JewelryCatalog from '@/components/JewelryCatalog';
import Footer from '@/components/Footer';
import ShopFilters from '@/components/ShopFilters';
import CategoryBanner from '@/components/CategoryBanner';
import { cn } from '@/lib/utils';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getSetting } from '@/app/actions/settingActions';
import type { OurProduct, ICategory } from '@/types';

export default async function ShopPage({ 
    searchParams 
}: { 
    searchParams?: { 
        search?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    } 
}) {
  await connectDB();

  // Get user location and currency info
  const country = headers().get('x-vercel-ip-country') || null;
  const rateStr = await getSetting('exchangeRateEuroToMGA');
  const exchangeRate = rateStr ? parseFloat(rateStr) : null;

  // Prepare filters from search params
  const { search, category: categoryName, minPrice, maxPrice, sort } = searchParams || {};
  const filter: any = { status: 'active' };

  if (search) {
      filter.name = { $regex: search, $options: 'i' };
  }

  if (categoryName && categoryName !== 'all') {
    const category = await Category.findOne({ name: categoryName }).lean();
    if (category) {
        filter.category = category._id;
    } else {
        // If an invalid category is passed, create a fake ID to find no products.
        filter.category = new mongoose.Types.ObjectId(); 
    }
  }
  
  if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  
  // Prepare sort options
  const sortOptions: any = {};
  if (sort) {
      const [key, order] = sort.split('_');
      sortOptions[key] = order === 'desc' ? -1 : 1;
  } else {
      sortOptions.createdAt = -1; // Default sort
  }

  const products: OurProduct[] = JSON.parse(JSON.stringify(
    await Product.find(filter).populate('category').sort(sortOptions)
  ));
  
  const categories: ICategory[] = JSON.parse(JSON.stringify(await Category.find().sort({ name: 1 })));
  
  // Get max price for slider range, rounded up to the nearest 50.
  const maxPriceResult = await Product.find({ status: 'active' }).sort({ price: -1 }).limit(1).select('price');
  const rawMaxPrice = maxPriceResult.length > 0 ? maxPriceResult[0].price : 2000;
  const maxPriceForSlider = Math.ceil(rawMaxPrice / 50) * 50;

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#F0F4F5]">
      <div className="w-full">
        <Header themeVariant="onLightBg" country={country} exchangeRate={exchangeRate} />
      </div>
      
      <div className={cn(
        "w-full flex-grow pt-24 md:pt-32"
      )}>
        <CategoryBanner />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Notre Collection
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez nos créations uniques. Utilisez les filtres pour trouver le bijou parfait qui vous correspond.
            </p>
          </div>
          <ShopFilters categories={categories} maxPrice={maxPriceForSlider} />
          <JewelryCatalog jewelries={products} country={country} exchangeRate={exchangeRate} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
