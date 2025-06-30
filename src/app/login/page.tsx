
'use client';

import { useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Gem } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/app/actions/authActions';

const initialState = {
  error: null,
};

export default function LoginPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: "Erreur de connexion",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

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
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  className="bg-accent border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
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
