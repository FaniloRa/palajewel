
'use client';

import { type ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  Package,
  Users2,
  Settings,
  PanelLeft,
  Search,
  LogOut,
  FileText,
  Gem,
  Tag,
  TicketPercent,
  UserCog,
  CalendarClock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Start with a consistent default role to prevent hydration mismatch.
  const [role, setRole] = useState<'admin' | 'caissier'>('caissier');

  // This effect runs only on the client after the initial render, preventing hydration errors.
  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    
    // Priority 1: Role from URL parameter. This is the source of truth upon login/navigation.
    if (roleFromUrl === 'admin' || roleFromUrl === 'caissier') {
      setRole(roleFromUrl);
      localStorage.setItem('userRole', roleFromUrl);
    } else {
      // Priority 2: Role from localStorage if no URL parameter is present.
      const storedRole = localStorage.getItem('userRole');
      if (storedRole === 'admin' || storedRole === 'caissier') {
        setRole(storedRole);
      }
      // If neither is present, it stays as the default 'caissier'.
    }
  }, [searchParams]);

  const allNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home, roles: ['admin', 'caissier'] },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart, roles: ['admin', 'caissier'] },
    { href: '/admin/appointments', label: 'Rendez-vous', icon: CalendarClock, roles: ['admin'] },
    { href: '/admin/products', label: 'Produits', icon: Package, roles: ['admin'] },
    { href: '/admin/categories', label: 'Catégories', icon: Tag, roles: ['admin'] },
    { href: '/admin/promo-codes', label: 'Codes Promo', icon: TicketPercent, roles: ['admin'] },
    { href: '/admin/customers', label: 'Clients', icon: Users2, roles: ['admin'] },
    { href: '/admin/users', label: 'Utilisateurs', icon: UserCog, roles: ['admin'] },
    { href: '/admin/content', label: 'Contenu', icon: FileText, roles: ['admin'] },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings, roles: ['admin'] },
  ];
  
  const navLinks = allNavLinks.filter(link => link.roles.includes(role));

  const addRoleQuery = (href: string) => {
    // To maintain the role across navigation, we append it if it's not already there.
    // This is a fallback, as localStorage should handle most cases.
    if (href.includes('?')) {
        return `${href}&role=${role}`;
    }
    return `${href}?role=${role}`;
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
    }
    // The <Link> component will handle the navigation to /login
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
        params.set('search', term);
    } else {
        params.delete('search');
    }
    // Using replace to avoid polluting browser history
    router.replace(`${pathname}?${params.toString()}`);
  };

  const isSearchablePage = ['/admin/customers', '/admin/orders', '/admin/products'].includes(pathname);


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-primary text-primary-foreground sm:flex">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b border-primary-foreground/20 px-4 lg:h-[60px] lg:px-6">
                 <Link href={addRoleQuery("/")} className="flex items-center gap-2 font-semibold text-primary-foreground">
                    <Gem className="h-6 w-6" />
                    <span className="">Pala Jewelry</span>
                 </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={addRoleQuery(link.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground hover:bg-primary-foreground/10",
                      pathname === link.href && "bg-primary-foreground/10 text-primary-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
           <div className="mt-auto p-4">
               <Link
                  href="/login"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <LogOut className="h-4 w-4" />
                   Déconnexion
                </Link>
            </div>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-primary text-primary-foreground">
               <nav className="grid gap-6 text-lg font-medium">
                <SheetClose asChild>
                  <Link
                    href={addRoleQuery("/")}
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-foreground text-lg font-semibold text-primary md:text-base"
                  >
                    <Gem className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Pala Jewelry</span>
                  </Link>
                </SheetClose>
                {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={addRoleQuery(link.href)}
                        className={cn(
                            'flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground',
                            pathname === link.href && "text-primary-foreground"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                      href="/login"
                      onClick={handleLogout}
                      className="mt-auto flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground"
                  >
                      <LogOut className="h-5 w-5" />
                      Déconnexion
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              defaultValue={searchParams.get('search') || ''}
              onChange={handleSearchChange}
              disabled={!isSearchablePage}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2 rounded-full px-3 py-1 h-auto">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="person portrait" />
                    <AvatarFallback>{role === 'admin' ? 'AD' : 'CA'}</AvatarFallback>
                </Avatar>
                <span className="capitalize hidden md:block">{role}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Compte {role === 'admin' ? 'Administrateur' : 'Caissier'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={addRoleQuery("/admin/settings")} className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" onClick={handleLogout} className="w-full cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
