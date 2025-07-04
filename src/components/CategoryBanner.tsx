
'use client';

import { useSearchParams } from 'next/navigation';
import { Gem } from 'lucide-react';

const CategoryBanner = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Do not render the banner if no category is specified in the URL
  if (!category || category.toLowerCase() === 'all') {
    return null;
  }

  return (
    <div className="w-full bg-primary text-primary-foreground py-4 mb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <Gem className="h-6 w-6" />
          <h2 className="text-2xl md:text-3xl font-headline">
            Collection : {category}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
