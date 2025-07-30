
'use client';

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ICategory } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';

interface ShopFiltersProps {
  categories: ICategory[];
  maxPrice: number;
}

export default function ShopFilters({ categories, maxPrice }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { currency, convertPrice, isLoading } = useCurrency();

  // The component's internal state for price range is always stored in EUR.
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || maxPrice,
  ]);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt_desc');

  // Convert values for display and for the slider component itself
  const displayMaxPrice = useMemo(() => {
    return Math.ceil(convertPrice(maxPrice));
  }, [maxPrice, convertPrice]);
  
  const displayPriceRange = useMemo(() => {
    return [
        Math.round(convertPrice(priceRange[0])),
        Math.round(convertPrice(priceRange[1]))
    ] as [number, number];
  }, [priceRange, convertPrice]);


  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(paramsToUpdate)) {
          if (value === null || value === '' || value === 'all' || (key === 'maxPrice' && Number(value) === maxPrice) || (key === 'minPrice' && Number(value) === 0)) {
              current.delete(key);
          } else {
              current.set(key, String(value));
          }
      }
      return current.toString();
    },
    [searchParams, maxPrice]
  );
  
  // Debounce search term to avoid too many requests
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        const query = createQueryString({ search: searchTerm || null });
        router.push(`/shop?${query}`);
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, createQueryString, router]);
  
  const handleFilterChange = (key: string, value: string) => {
    const query = createQueryString({ [key]: value });
    startTransition(() => {
        router.push(`/shop?${query}`);
    });
  }

  const handlePriceCommit = (newRange: [number, number]) => {
    const query = createQueryString({ minPrice: newRange[0], maxPrice: newRange[1] });
    startTransition(() => {
        router.push(`/shop?${query}`);
    });
  }
  
  const handleResetFilters = () => {
    startTransition(() => {
        router.push('/shop');
    });
  };

  return (
    <div className="mb-10 p-6 bg-card rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Search */}
            <div className="space-y-2">
                <Label htmlFor="search">Rechercher par nom</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="search"
                        placeholder="Ex: Collier Élégance..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={(value) => { setCategory(value); handleFilterChange('category', value)}}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {/* Price Range */}
            <div className="space-y-2 lg:col-span-2">
                <div className="flex justify-between items-center mb-2">
                    <Label>Gamme de prix</Label>
                    <span className="text-sm font-medium text-primary">
                      {isLoading ? '...' : 
                        currency.code === 'MGA' 
                          ? `${displayPriceRange[0].toLocaleString('fr-FR')} - ${displayPriceRange[1].toLocaleString('fr-FR')} Ar`
                          : `${priceRange[0]} - ${priceRange[1]} €`
                      }
                    </span>
                </div>
                <Slider
                    min={0}
                    max={maxPrice}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    onValueCommit={handlePriceCommit}
                    disabled={isLoading}
                />
            </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Label htmlFor="sort-by" className="shrink-0">Trier par</Label>
                <Select value={sort} onValueChange={(value) => { setSort(value); handleFilterChange('sort', value) }}>
                    <SelectTrigger id="sort-by" className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Trier par..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt_desc">Nouveautés</SelectItem>
                        <SelectItem value="price_asc">Prix : croissant</SelectItem>
                        <SelectItem value="price_desc">Prix : décroissant</SelectItem>
                        <SelectItem value="name_asc">Nom : A-Z</SelectItem>
                        <SelectItem value="name_desc">Nom : Z-A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
             <Button variant="ghost" onClick={handleResetFilters} disabled={isPending}>
                <X className="mr-2 h-4 w-4" />
                Réinitialiser les filtres
            </Button>
        </div>
    </div>
  );
}
