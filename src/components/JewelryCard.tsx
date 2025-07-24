
'use client'

import Image from 'next/image';
import type { OurProduct } from '@/types';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';

interface JewelryCardProps {
  item: OurProduct;
  country: string | null;
  exchangeRate: number | null;
}

const JewelryCard: React.FC<JewelryCardProps> = ({ item, country, exchangeRate }) => {
  const { formatPrice, isLoading } = useCurrency(country, exchangeRate);

  return (
    <Link href={`/produits/${item.id}`} className="group">
      <div className="flex flex-col items-center text-center text-slate-800 h-full">
        <div className="relative w-full h-64 md:h-72 mb-4 overflow-hidden rounded-md shadow-lg bg-white">
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            fill
            style={{objectFit: "cover"}}
            data-ai-hint={item.dataAiHint}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="font-headline text-lg font-medium mb-1">{item.name}</h3>
        <p className="font-body text-xs text-slate-600 mb-1">{item.description}</p>
        <p className="font-body text-base font-semibold text-primary mt-auto">
            {isLoading ? '...' : formatPrice(item.price)}
        </p>
      </div>
    </Link>
  );
};

export default JewelryCard;
