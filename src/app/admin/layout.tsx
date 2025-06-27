
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Home,
  ShoppingCart,
  Package,
  Users2,
  Settings,
  PanelLeft,
  Search,
  LogOut,
  FileText
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-primary text-primary-foreground sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-foreground text-lg font-semibold text-primary md:h-8 md:w-8 md:text-base"
          >
            <Package className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Pala Jewelry</span>
          </Link>
          <Link
            href="/admin"
            className="flex w-full justify-center items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:bg-muted/90"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="flex w-full justify-center items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            Commandes
            <Badge variant="secondary" className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              6
            </Badge>
          </Link>
          <Link
            href="/admin/products"
            className="flex w-full justify-center items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground"
          >
            <Package className="h-4 w-4" />
            Produits
          </Link>
           <Link
            href="/admin/content"
            className="flex w-full justify-center items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground"
          >
            <FileText className="h-4 w-4" />
            Contenu
          </Link>
          <Link
            href="/admin/customers"
            className="flex w-full justify-center items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground"
          >
            <Users2 className="h-4 w-4" />
            Clients
          </Link>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="flex w-full justify-center items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/70 transition-all hover:text-primary-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
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
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-foreground text-lg font-semibold text-primary md:text-base"
                >
                  <Package className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Pala Jewelry</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-4 px-2.5 text-primary-foreground hover:text-primary-foreground/80"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Commandes
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <Package className="h-5 w-5" />
                  Produits
                </Link>
                <Link
                    href="/admin/content"
                    className="flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground"
                >
                    <FileText className="h-5 w-5" />
                    Contenu
                </Link>
                <Link
                  href="/admin/customers"
                  className="flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Clients
                </Link>
                 <Link
                    href="#"
                    className="mt-auto flex items-center gap-4 px-2.5 text-primary-foreground/70 hover:text-primary-foreground"
                 >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="person portrait" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="w-full cursor-pointer">
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
