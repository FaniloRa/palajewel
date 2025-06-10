// src/components/Header.tsx
import Link from 'next/link';
import { Search, ShoppingBag, User, Gem, Menu } from 'lucide-react';

const navLinks = [
  { href: '/accueil', label: 'Accueil' },
  { href: '/shop', label: 'Shop' },
  { href: '/produits', label: 'Produits' },
  { href: '/blog', label: 'Blog' },
  { href: '/page', label: 'Page' },
];

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 py-4 md:py-6">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-accent">
        {/* Left: Nav Links (Desktop) / Hamburger (Mobile) */}
        <div className="flex-1 flex justify-start mt-8">
          <div className="hidden md:flex items-center space-x-5 lg:space-x-7 mt-1"> {/* Added mt-1 */}
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-body text-sm hover:text-accent/80 transition-colors">
                  {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <button aria-label="Open menu" className="text-accent focus:outline-none">
                 <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex-shrink-0 mx-auto"> {/* Adjusted for better centering with flex */}
          <Link href="/" className="flex flex-col items-center group">
            <Gem size={20} className="mb-0.5 text-accent group-hover:text-accent/80 transition-colors" />
            <span className="font-headline text-2xl lg:text-3xl tracking-wider text-accent uppercase group-hover:text-accent/80 transition-colors">
              Pala
            </span>
          </Link>
        </div>

        {/* Right: Icon Buttons */}
        <div className="flex-1 flex justify-end mt-8">
          <div className="flex items-center space-x-3 sm:space-x-4 mt-1"> {/* Added mt-1 */}
            <button aria-label="Search" className="hover:text-accent/80 transition-colors p-1">
              <Search size={18} />
            </button>
            <button aria-label="Shopping Bag" className="hover:text-accent/80 transition-colors p-1">
              <ShoppingBag size={18} />
            </button>
            <button aria-label="User Account" className="hover:text-accent/80 transition-colors p-1">
              <User size={18} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
