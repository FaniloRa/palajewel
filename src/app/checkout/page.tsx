
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { cart, totalPrice, cartCount } = useCart();
  const router = useRouter();

  // Redirect to shop if cart is empty. This runs on the client.
  useEffect(() => {
    if (cartCount === 0) {
      router.replace('/shop');
    }
  }, [cartCount, router]);

  // Render a loading/placeholder state while redirecting
  if (cartCount === 0) {
    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
            <Header themeVariant="onLightBg" />
            <main className="flex-grow flex items-center justify-center">
                <p>Votre panier est vide. Redirection vers la boutique...</p>
            </main>
            <Footer />
        </div>
    );
  }

  const shippingCost = 5.00; // Example shipping cost
  const totalWithShipping = totalPrice + shippingCost;

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
      <Header themeVariant="onLightBg" />

      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Caisse
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Presque terminé ! Remplissez vos informations pour finaliser votre commande.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <form className="space-y-8 bg-card p-8 rounded-lg border shadow-sm">
              <div>
                <h2 className="text-xl font-headline text-accent-foreground mb-4">Informations de contact</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input id="email" type="email" placeholder="vous@exemple.com" required />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-headline text-accent-foreground mb-4">Adresse de livraison</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="first-name">Prénom</Label>
                    <Input id="first-name" type="text" required />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="last-name">Nom</Label>
                    <Input id="last-name" type="text" required />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" type="text" required />
                  </div>
                   <div className="col-span-2">
                    <Label htmlFor="apartment">Appartement, suite, etc. (facultatif)</Label>
                    <Input id="apartment" type="text" />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" type="text" required />
                  </div>
                  <div>
                    <Label htmlFor="zip-code">Code postal</Label>
                    <Input id="zip-code" type="text" required />
                  </div>
                   <div className="col-span-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input id="country" type="text" defaultValue="Madagascar" required />
                  </div>
                </div>
              </div>
              
               <Button type="submit" size="lg" className="w-full !mt-10">
                Procéder au paiement
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-8 rounded-lg border shadow-sm sticky top-32">
                <h2 className="text-xl font-headline text-accent-foreground mb-6">Résumé de la commande</h2>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md border overflow-hidden shrink-0">
                                    <Image src={item.product.imageUrl} alt={item.product.name} fill style={{objectFit: 'cover'}} />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium text-sm">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-medium text-sm">{(item.product.price * item.quantity).toFixed(2)} €</p>
                        </div>
                    ))}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Sous-total</p>
                        <p>{totalPrice.toFixed(2)} €</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Livraison</p>
                        <p>{shippingCost.toFixed(2)} €</p>
                    </div>
                </div>
                <Separator className="my-6" />
                 <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{totalWithShipping.toFixed(2)} €</p>
                </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
