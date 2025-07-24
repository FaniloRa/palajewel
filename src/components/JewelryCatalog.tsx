
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { OurProduct } from '@/types';
import JewelryCard from './JewelryCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from '@/lib/utils';

interface JewelryCatalogProps {
  jewelries: OurProduct[];
}

const ITEMS_PER_PAGE = 12;

const JewelryCatalog: React.FC<JewelryCatalogProps> = ({ jewelries }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // The 'jewelries' prop is now pre-filtered by the server.
  // We only need to handle pagination on the client.
  const pageCount = Math.ceil(jewelries.length / ITEMS_PER_PAGE);

  const currentJewelries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return jewelries.slice(startIndex, endIndex);
  }, [jewelries, currentPage]);

  // Reset to page 1 if the jewelry list changes (due to filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [jewelries]);


  const handlePageChange = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' }); // Scroll to top of catalog
  };

  const renderPaginationItems = () => {
    if (pageCount <= 1) return null;

    const pageNumbers = [];
    const displayedPages = new Set<number>();

    // Always show first and last page
    displayedPages.add(1);
    displayedPages.add(pageCount);

    // Show pages around current page
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 0 && i <= pageCount) {
            displayedPages.add(i);
        }
    }
    
    const sortedPages = Array.from(displayedPages).sort((a,b) => a-b);
    let lastPage: number | null = null;
    
    for (const page of sortedPages) {
        if(lastPage !== null && page - lastPage > 1) {
             pageNumbers.push(<PaginationItem key={`ellipsis-${lastPage}`}><PaginationEllipsis /></PaginationItem>);
        }
        pageNumbers.push(
            <PaginationItem key={page}>
                <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer"
                >
                    {page}
                </PaginationLink>
            </PaginationItem>
        );
        lastPage = page;
    }

    return pageNumbers;
  };

  return (
    <section className="w-full">
        {/* Products Grid */}
        {currentJewelries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {currentJewelries.map(item => (
              <JewelryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-600 font-body text-lg py-20 bg-card rounded-lg border">
            <h3 className="text-2xl font-headline text-primary mb-2">Aucun Résultat</h3>
            <p className="text-muted-foreground">Aucun bijou ne correspond à vos critères de recherche.</p>
            <p className="text-sm mt-1 text-muted-foreground">Essayez de modifier ou de réinitialiser vos filtres.</p>
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className={cn('cursor-pointer', currentPage === 1 ? 'pointer-events-none opacity-50' : '')}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className={cn('cursor-pointer', currentPage === pageCount ? 'pointer-events-none opacity-50' : '')}
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
