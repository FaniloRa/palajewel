
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { InlineWidget } from "react-calendly";
import { Card, CardContent } from '@/components/ui/card';

export default function RendezVousPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
            <Header themeVariant="onLightBg" />
            <main className="flex-grow container mx-auto px-4 py-24 md:py-32 flex flex-col items-center">
                 <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                        Prendre un Rendez-vous
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                      Planifiez un moment privilégié avec nos artisans pour créer votre bijou sur mesure. Choisissez une consultation en boutique ou en visioconférence.
                    </p>
                </div>
                
                <Card className="w-full max-w-4xl overflow-hidden shadow-lg border">
                    <CardContent className="p-0">
                        {/* 
                          Remplacez l'URL ci-dessous par votre propre lien Calendly.
                          Vous pouvez configurer différents types d'événements (ex: "Consultation en boutique", "Appel Visio") 
                          depuis votre compte Calendly, et vos clients pourront choisir celui qu'ils préfèrent.
                        */}
                        <InlineWidget 
                            url="https://calendly.com/your-username" 
                            styles={{
                                height: '700px'
                            }}
                        />
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
