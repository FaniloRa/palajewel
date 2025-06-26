'use client';

import React, { useState, useMemo } from 'react';
import type { OurProduct } from '@/types';
import JewelryCard from './JewelryCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface JewelryCatalogProps {
  jewelries: OurProduct[];
}

const JewelryCatalog: React.FC<JewelryCatalogProps> = ({ jewelries }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJewelries = useMemo(() => {
    if (!searchTerm.trim()) {
      return jewelries;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return jewelries.filter(item =>
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [jewelries, searchTerm]);

  return (
    <section className="w-full">
        {/* Header with Title and Search Bar */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-background self-start sm:self-center">
            Nos produits
          </h2>
          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-accent border-border text-accent-foreground placeholder:text-muted-foreground focus:border-primary w-full"
              aria-label="Rechercher des produits"
            />
          </div>
        </div>
        
        {/* Products Grid */}
        {filteredJewelries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredJewelries.map(item => (
              <JewelryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 font-body text-lg py-10">
            Aucun bijou ne correspond à votre recherche.
          </p>
        )}
    </section>
  );
};

export default JewelryCatalog;
