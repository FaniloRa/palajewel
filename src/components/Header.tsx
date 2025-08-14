
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, ChevronDown, Home, Store, Gem, Calendar, Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import palabiglogo from '@/app/palabiglogo.png';
import logo2 from '@/app/logo2.png';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Cart } from '@/components/Cart';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/shop', label: 'Shop', icon: Store },
  { href: '/#nos-produits-section', label: 'Produits', icon: Gem },
  { href: '/rendez-vous', label: 'Rendez-vous', icon: Calendar },
];

interface HeaderProps {
  themeVariant?: 'default' | 'onLightBg';
  country?: string | null;
  exchangeRate?: number | null;
}

const Header = ({ themeVariant = 'default', country, exchangeRate }: HeaderProps) => {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { currency, isLoading } = useCurrency(); // Get currency state from hook
  
  const isHomePage = pathname === '/';
  const showMobileLogo = !['/shop', '/rendez-vous'].includes(pathname) && !pathname.startsWith('/produits');
  const logoSrc = isHomePage ? palabiglogo : logo2;
  const textClass = themeVariant === 'onLightBg' ? 'text-accent-foreground' : 'text-accent';
  const hoverTextClass = themeVariant === 'onLightBg' ? 'hover:text-accent-foreground/80' : 'hover:text-accent/80';
  const currencyHoverTextClass = themeVariant === 'onLightBg' ? 'hover:text-accent-foreground/80' : 'hover:text-accent-foreground';

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
             <Sheet>
                <SheetTrigger asChild>
                    <button aria-label="Open menu" className={cn("focus:outline-none mt-1", hoverTextClass)}>
                        <Menu size={24} />
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-background text-foreground">
                    <div className="p-6">
                       <SheetClose asChild>
                            <Link href="/" className="group">
                                <Image
                                src={logo2}
                                alt="Pala Jewelry Logo"
                                width={120}
                                height={60}
                                className="group-hover:opacity-80 transition-opacity"
                                />
                            </Link>
                        </SheetClose>
                    </div>
                    <nav className="flex-grow px-4">
                        {navLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-4 rounded-lg px-3 py-3 text-foreground/70 transition-all hover:text-foreground hover:bg-muted',
                                        pathname === link.href && "bg-muted text-foreground"
                                    )}
                                >
                                <link.icon className="h-5 w-5" />
                                <span className="text-base font-medium">{link.label}</span>
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>
                    <div className="mt-auto p-6 border-t border-border">
                        <div className="flex justify-center space-x-4 mb-4">
                          <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground"><Facebook size={20} /></Link>
                          <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground"><Instagram size={20} /></Link>
                          <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground"><Twitter size={20} /></Link>
                        </div>
                        <SheetClose asChild>
                          <Button asChild variant="default" className="w-full">
                            <Link href="/rendez-vous">Prendre Rendez-vous</Link>
                          </Button>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Center: Logo */}
        {showMobileLogo && (
            <div className="flex-1 flex justify-center items-center md:hidden">
                <Link href="/" className="group">
                    <Image
                    src={logo2}
                    alt="Pala Jewelry Logo"
                    width={100}
                    height={50}
                    className="group-hover:opacity-80 transition-opacity"
                    />
                </Link>
            </div>
        )}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="group">
            <Image
              src={logoSrc}
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
                 <Button variant="ghost" className={cn("flex items-center gap-1 p-1 h-auto font-body text-sm", currencyHoverTextClass)}>
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
