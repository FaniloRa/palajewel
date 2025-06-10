// src/components/NewsletterSection.tsx
'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';


const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse e-mail valide.",
        variant: "destructive",
      });
      return;
    }
    // Simulate newsletter subscription
    console.log('Email submitted:', email);
    toast({
      title: "Merci !",
      description: "Vous êtes inscrit à notre newsletter.",
    });
    setEmail(''); // Reset email input
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-[#EFEFEE] text-accent-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: Image */}
          <div className="md:w-1/2 lg:w-2/5">
            <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://placehold.co/600x800.png"
                alt="Modèle portant des bijoux PALA"
                layout="fill"
                objectFit="cover"
                data-ai-hint="fashion model jewelry"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Text Content & Form */}
          <div className="md:w-1/2 lg:w-3/5 text-center md:text-left">
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Restons en contact
            </h2>
            <p className="font-body text-base text-slate-700 mb-8 max-w-md mx-auto md:mx-0">
              Des nouvelles et de l&apos;inspiration directement dans votre boîte
              de réception, chaque semaine. Amusons-nous, avec style.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto md:mx-0">
              <Input
                type="email"
                placeholder="Entrer votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                aria-label="Adresse e-mail pour la newsletter"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto px-5 py-2.5"
                aria-label="S'inscrire à la newsletter"
              >
                <ChevronRight size={24} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
