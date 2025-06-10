'use client';

import React, { useState, useMemo } from 'react';
import type { Jewelry, SortOption, FilterTypeOption, JewelryTypeOption } from '@/types';
import JewelryCard from './JewelryCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Filter, ArrowUpDown } from 'lucide-react';

interface JewelryCatalogProps {
  jewelries: Jewelry[];
}

const jewelryTypes: FilterTypeOption[] = ['All', 'Necklace', 'Ring', 'Earrings', 'Bracelet'];

const JewelryCatalog: React.FC<JewelryCatalogProps> = ({ jewelries }) => {
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [filterType, setFilterType] = useState<FilterTypeOption>('All');

  const filteredAndSortedJewelries = useMemo(() => {
    let items = [...jewelries];

    if (filterType !== 'All') {
      items = items.filter(item => item.type === filterType);
    }

    if (sortOption === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    }
    // 'default' sort is the original order (or by ID if implemented)

    return items;
  }, [jewelries, sortOption, filterType]);

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-accent-foreground mb-10">
          Our Collection
        </h2>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg shadow-md bg-card">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={20} className="text-primary" />
            <Label htmlFor="filter-type" className="text-sm font-medium text-card-foreground">Filter by Type:</Label>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as FilterTypeOption)}
            >
              <SelectTrigger id="filter-type" className="w-full sm:w-[180px] bg-input border-border text-foreground">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                {jewelryTypes.map(type => (
                  <SelectItem key={type} value={type} className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown size={20} className="text-primary" />
            <Label htmlFor="sort-order" className="text-sm font-medium text-card-foreground">Sort by Price:</Label>
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger id="sort-order" className="w-full sm:w-[180px] bg-input border-border text-foreground">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                <SelectItem value="default" className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Default</SelectItem>
                <SelectItem value="price-asc" className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Price: Low to High</SelectItem>
                <SelectItem value="price-desc" className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAndSortedJewelries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedJewelries.map(item => (
              <JewelryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body text-lg">
            No jewelry matches your current selection.
          </p>
        )}
      </div>
    </section>
  );
};

export default JewelryCatalog;