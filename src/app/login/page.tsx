
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import logo2 from '@/app/logo2.png';

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

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Se connecter
    </Button>
  )
}

export default function LoginPage() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(loginUser, initialState);

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
             <Link href="/" className="flex justify-center group mb-4">
                <Image
                  src={logo2}
                  alt="Pala Jewelry Logo"
                  width={120}
                  height={60}
                  className="group-hover:opacity-80 transition-opacity"
                />
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
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
