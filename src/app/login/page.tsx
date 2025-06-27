

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to the admin dashboard
    router.push('/admin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
      <Header themeVariant="onLightBg" />

      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-24 md:py-32">
        <Card className="w-full max-w-md shadow-xl bg-accent text-accent-foreground">
          <CardHeader className="text-center">
             <Link href="/" className="flex flex-col items-center group mb-4">
                <Gem size={28} className="mb-1 text-primary group-hover:text-primary/80 transition-colors" />
                <span className="font-headline text-3xl tracking-wider text-primary uppercase group-hover:text-primary/80 transition-colors">
                  Pala
                </span>
              </Link>
            <CardTitle className="text-2xl font-headline text-primary">Back Office</CardTitle>
            <CardDescription className="text-muted-foreground pt-1">Connectez-vous à votre espace administrateur</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-accent border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-accent border-border focus:border-primary"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Se connecter</Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
