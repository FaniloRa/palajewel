import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RendezVousPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
            <Header themeVariant="onLightBg" />
            <main className="flex-grow container mx-auto px-4 py-24 md:py-32 flex items-center justify-center">
                 <Card className="w-full max-w-2xl text-center p-8">
                    <CardHeader>
                        <CardTitle className="text-4xl font-headline text-primary">Prendre un Rendez-vous</CardTitle>
                        <CardDescription className="text-lg mt-2 text-muted-foreground">Contactez-nous pour planifier votre visite personnalisée en boutique.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>La fonctionnalité de prise de rendez-vous en ligne sera bientôt disponible.</p>
                        <p className="mt-4 text-muted-foreground">En attendant, vous pouvez nous joindre par :</p>
                        <div className="mt-4 font-semibold text-primary">
                            <p>Téléphone : +261 38 22 224 84</p>
                            <p>Email : contact@palajewelry.com</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
