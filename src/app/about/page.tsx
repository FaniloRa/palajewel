
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Gem, Target, Users, History } from 'lucide-react';
import StorefrontSection from '@/components/StorefrontSection';

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <Header themeVariant="onLightBg" />

      <div className="w-full flex-grow pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
          <div className="text-center mb-16">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Notre Histoire
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Au cœur de chaque création Pala se trouve une passion pour l'excellence et un dévouement à l'art de la joaillerie, transmis de génération en génération.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="font-headline text-3xl text-primary mb-4">L'Héritage d'un Savoir-Faire</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fondée en 1922, la maison Pala a bâti sa réputation sur une quête incessante de la perfection. Chaque bijou est le fruit d'un héritage familial, où les secrets de l'artisanat sont précieusement gardés et enrichis au fil du temps.
                </p>
                <p>
                  Nous croyons que chaque pièce doit raconter une histoire, celle des matériaux nobles que nous choisissons avec soin, et celle des mains expertes qui leur donnent vie. C'est cette philosophie qui nous guide et qui fait de chaque bijou Pala une œuvre unique.
                </p>
              </div>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
                 <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Atelier de joaillerie Pala" 
                    fill
                    style={{objectFit: 'cover'}}
                    data-ai-hint="jewelry workshop"
                />
            </div>
          </div>
        </div>

        <StorefrontSection />

      </div>

      <Footer />
    </main>
  );
}
