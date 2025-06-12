// src/components/Header.tsx
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import Image from 'next/image';
import palabiglogo from '@/app/palabiglogo.png'; // Importation de la nouvelle image du logo

const navLinks = [
  { href: '/accueil', label: 'Accueil' },
  { href: '/shop', label: 'Shop' },
  { href: '/produits', label: 'Produits' },
  { href: '/blog', label: 'Blog' },
  { href: '/page', label: 'Page' },
];

interface HeaderProps {
  themeVariant?: 'default' | 'onLightBg';
}

const Header = ({ themeVariant = 'default' }: HeaderProps) => {
  const textClass = themeVariant === 'onLightBg' ? 'text-accent-foreground' : 'text-accent';
  const hoverTextClass = themeVariant === 'onLightBg' ? 'hover:text-accent-foreground/80' : 'hover:text-accent/80';

  return (
    <header className="absolute top-0 left-0 right-0 z-20 py-4 md:py-6">
      <nav className={`container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between ${textClass} font-kanit`}>
        {/* Left: Nav Links (Desktop) / Hamburger (Mobile) */}
        <div className="flex-1 flex justify-start">
          <div className="hidden md:flex items-center space-x-5 lg:space-x-7 mt-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={`font-body text-sm ${hoverTextClass} transition-colors`}>
                  {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <button aria-label="Open menu" className={`focus:outline-none mt-1 ${hoverTextClass}`}> {/* Ensured hover class and base inherited class */}
                 <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex-shrink-0 mx-auto">
          <Link href="/" className="group">
            <Image
              src={palabiglogo} // Utilisation de l'image importée
              alt="Pala Jewelry Logo"
              width={120} // Vous pouvez ajuster la largeur
              height={60}  // Vous pouvez ajuster la hauteur
              className="group-hover:opacity-80 transition-opacity"
              priority
            />
          </Link>
        </div>

        {/* Right: Icon Buttons */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center space-x-3 sm:space-x-4 mt-1">
            <button aria-label="Search" className={`${hoverTextClass} transition-colors p-1`}>
              <Search size={18} />
            </button>
            <button aria-label="Shopping Bag" className={`${hoverTextClass} transition-colors p-1`}>
              <ShoppingBag size={18} />
            </button>
            <button aria-label="User Account" className={`${hoverTextClass} transition-colors p-1`}>
              <User size={18} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
