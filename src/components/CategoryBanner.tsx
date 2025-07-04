'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Map category names to their specific banner images
const categoryBanners: { [key: string]: { src: string; alt: string; 'data-ai-hint': string } } = {
  'anneaux': {
    src: 'https://placehold.co/1600x400.png',
    alt: 'Bannière pour la collection Anneaux',
    'data-ai-hint': 'rings jewelry'
  },
  'montre': {
    src: 'https://placehold.co/1600x400.png',
    alt: 'Bannière pour la collection Montres',
    'data-ai-hint': 'watch fashion'
  },
  'bracelet': {
    src: 'https://placehold.co/1600x400.png',
    alt: 'Bannière pour la collection Bracelets',
    'data-ai-hint': 'bracelet model'
  },
    "boucles d'oreilles": {
    src: 'https://placehold.co/1600x400.png',
    alt: "Bannière pour la collection Boucles d'oreilles",
    'data-ai-hint': 'earrings model'
  },
  'collier': {
    src: 'https://placehold.co/1600x400.png',
    alt: 'Bannière pour la collection Colliers',
    'data-ai-hint': 'necklace model'
  },
  'pendentif': {
    src: 'https://placehold.co/1600x400.png',
    alt: 'Bannière pour la collection Pendentifs',
    'data-ai-hint': 'pendant jewelry'
  },
  // Default banner for any other category
  default: {
    src: 'https://placehold.co/1600x400.png',
    alt: 'Bannière de la collection de bijoux',
    'data-ai-hint': 'jewelry collection'
  }
};


const CategoryBanner = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Do not render the banner if no category is specified or if it's 'all'
  if (!category || category.toLowerCase() === 'all') {
    return null;
  }
  
  const categoryKey = category.toLowerCase();
  const banner = categoryBanners[categoryKey] || categoryBanners.default;


  return (
    <div className="relative w-full h-56 md:h-64 mb-12">
        <Image 
            src={banner.src}
            alt={banner.alt}
            fill
            style={{objectFit: 'cover'}}
            data-ai-hint={banner['data-ai-hint']}
            priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
                 <p className="font-body text-sm uppercase tracking-widest">Collection</p>
                 <h1 className="font-headline text-4xl md:text-5xl font-bold capitalize">
                    {category}
                </h1>
            </div>
        </div>
    </div>
  );
};

export default CategoryBanner;
