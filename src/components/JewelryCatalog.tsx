'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { OurProduct } from '@/types';
import JewelryCard from './JewelryCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface JewelryCatalogProps {
  jewelries: OurProduct[];
}

const ITEMS_PER_PAGE = 8;

const JewelryCatalog: React.FC<JewelryCatalogProps> = ({ jewelries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const pageCount = Math.ceil(filteredJewelries.length / ITEMS_PER_PAGE);

  const currentJewelries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredJewelries.slice(startIndex, endIndex);
  }, [filteredJewelries, currentPage]);

  useEffect(() => {
    if (currentPage > pageCount && pageCount > 0) {
      setCurrentPage(pageCount);
    } else if (currentPage === 0 && pageCount > 0) {
      setCurrentPage(1);
    }
  }, [searchTerm, pageCount, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (currentPage > 2) {
        paginationItems.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }

      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < pageCount) {
          paginationItems.push(
            <PaginationItem key={i}>
              <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < pageCount - 1) {
        paginationItems.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }

      paginationItems.push(
        <PaginationItem key={pageCount}>
          <PaginationLink isActive={currentPage === pageCount} onClick={() => handlePageChange(pageCount)}>
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return paginationItems;
  };
  
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on new search
              }}
              className="pl-10 bg-accent border-border text-accent-foreground placeholder:text-muted-foreground focus:border-primary w-full"
              aria-label="Rechercher des produits"
            />
          </div>
        </div>
        
        {/* Products Grid */}
        {currentJewelries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {currentJewelries.map(item => (
              <JewelryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 font-body text-lg py-10">
            Aucun bijou ne correspond à votre recherche.
          </p>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className={currentPage === pageCount ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
    </section>
  );
};

export default JewelryCatalog;
