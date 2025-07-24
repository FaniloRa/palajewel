

'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import palabiglogo from '@/app/palabiglogo.png';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Cart } from '@/components/Cart';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/shop', label: 'Shop' },
  { href: '/#nos-produits-section', label: 'Produits' },
  { href: '/rendez-vous', label: 'Rendez-vous' },
];

interface HeaderProps {
  themeVariant?: 'default' | 'onLightBg';
  country?: string | null;
  exchangeRate?: number | null;
}

const Header = ({ themeVariant = 'default', country, exchangeRate }: HeaderProps) => {
  const { cartCount } = useCart();
  const { currency, isLoading } = useCurrency(); // Get currency state from hook
  const textClass = themeVariant === 'onLightBg' ? 'text-accent-foreground' : 'text-accent';
  const hoverTextClass = themeVariant === 'onLightBg' ? 'hover:text-accent-foreground/80' : 'hover:text-accent/80';

  // Store server-provided data in session storage for client-side hooks to access
  useEffect(() => {
    // Only set these if they haven't been set by the user's explicit choice
    if (country && !localStorage.getItem('userCurrency')) {
      sessionStorage.setItem('detectedCountry', country);
    }
    if (exchangeRate) {
      sessionStorage.setItem('exchangeRate', String(exchangeRate));
    }
  }, [country, exchangeRate]);

  const handleCurrencyChange = (newCurrency: 'EUR' | 'MGA') => {
    localStorage.setItem('userCurrency', newCurrency);
    // Reload the page to apply the new currency everywhere
    window.location.reload();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 py-4 md:py-6">
      <nav className={cn("container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between font-kanit", textClass)}>
        {/* Left: Nav Links (Desktop) / Hamburger (Mobile) */}
        <div className="flex-1 flex justify-start">
          <div className="hidden md:flex items-center space-x-5 lg:space-x-7 mt-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={cn("font-body text-sm transition-colors", hoverTextClass)}>
                  {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <button aria-label="Open menu" className={cn("focus:outline-none mt-1", hoverTextClass)}>
                 <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex-shrink-0 mx-auto">
          <Link href="/" className="group">
            <Image
              src={palabiglogo}
              alt="Pala Jewelry Logo"
              width={120}
              height={60}
              className="group-hover:opacity-80 transition-opacity"
              priority
            />
          </Link>
        </div>

        {/* Right: Icon Buttons */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center space-x-3 sm:space-x-4 mt-1">
            <button aria-label="Search" className={cn("transition-colors p-1", hoverTextClass)}>
              <Search size={18} />
            </button>
            
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Shopping Bag" className={cn("transition-colors p-1 relative", hoverTextClass)}>
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                        {cartCount}
                    </Badge>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] p-0">
                  <Cart />
              </SheetContent>
            </Sheet>

            <Link href="/login" aria-label="User Account" className={cn("transition-colors p-1", hoverTextClass)}>
              <User size={18} />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className={cn("flex items-center gap-1 p-1 h-auto font-body text-sm", hoverTextClass)}>
                    {isLoading ? '...' : currency.code}
                    <ChevronDown size={16} />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleCurrencyChange('EUR')}>
                  EUR (€)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleCurrencyChange('MGA')}>
                  MGA (Ar)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
