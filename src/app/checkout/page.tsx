

'use client';

import { useEffect, useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { applyPromoCode } from '@/app/actions/promoCodeActions';
import { useCurrency } from '@/hooks/useCurrency';

// Mock fetching currency data on the client side for checkout
// In a real app, this might come from a layout or parent component
function useClientCurrency() {
  const [country, setCountry] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    // This is a simplified client-side fetch.
    // We assume the settings are available via an API or are pre-fetched.
    async function fetchData() {
        try {
            // This is a placeholder for how you might fetch these values
            const countryRes = await fetch('/api/get-country'); // FAKE API
            const countryData = await countryRes.json();
            setCountry(countryData.country);

            const rateRes = await fetch('/api/get-rate'); // FAKE API
            const rateData = await rateRes.json();
            setExchangeRate(rateData.rate);

        } catch (e) {
            // Fallback to EUR if APIs fail
            setCountry(null);
            setExchangeRate(null);
            console.error("Could not fetch client-side currency data", e)
        }
    }
    // In this mocked example, we just set them.
    // A real implementation would fetch or receive this data.
    setCountry(null); // Default to EUR for this example
    setExchangeRate(4750); // Mock rate
  }, []);

  return { country, exchangeRate };
}


export default function CheckoutPage() {
  const { cart, totalPrice, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const { country, exchangeRate } = useClientCurrency();
  const { formatPrice, currency, isLoading: isCurrencyLoading } = useCurrency(country, exchangeRate);
  
  const [isApplying, startTransition] = useTransition();
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');


  // Redirect to shop if cart is empty. This runs on the client.
  useEffect(() => {
    if (cartCount === 0) {
      router.replace('/shop');
    }
  }, [cartCount, router]);

  const handleApplyPromoCode = async () => {
    startTransition(async () => {
      const result = await applyPromoCode(promoCodeInput, totalPrice);
      if (result.error) {
        toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
        setAppliedDiscount(0);
        setPromoMessage('');
      } else if (result.success && result.discount !== undefined) {
        toast({ title: 'Succès', description: result.message });
        setAppliedDiscount(result.discount); // Discount is always in EUR from backend
        setPromoMessage(result.message || '');
      }
    });
  };

  const shippingCost = useMemo(() => {
      return currency.code === 'MGA' ? 20000 : 5.00;
  }, [currency]);


  const finalTotal = useMemo(() => {
      const subtotalInEur = totalPrice;
      const discountInEur = appliedDiscount;
      const shippingInEur = currency.code === 'MGA' && exchangeRate ? (shippingCost / exchangeRate) : shippingCost;

      const totalInEur = subtotalInEur - discountInEur + shippingInEur;
      
      if (currency.code === 'MGA' && exchangeRate) {
          return totalInEur * exchangeRate;
      }
      return totalInEur;
  }, [totalPrice, appliedDiscount, shippingCost, currency, exchangeRate]);

  // Render a loading/placeholder state while redirecting
  if (cartCount === 0 || isCurrencyLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
            <Header themeVariant="onLightBg" />
            <main className="flex-grow flex items-center justify-center">
                <p>Chargement de votre commande...</p>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
      <Header themeVariant="onLightBg" country={country} exchangeRate={exchangeRate} />

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
                            <p className="font-medium text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>
                <Separator className="my-6" />
                <div className="flex items-start gap-4">
                    <div className="grid gap-2 flex-grow">
                        <Label htmlFor="promo-code">Code promo</Label>
                        <Input 
                            id="promo-code" 
                            placeholder="Entrer le code" 
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            disabled={isApplying}
                        />
                    </div>
                    <Button onClick={handleApplyPromoCode} disabled={isApplying || !promoCodeInput} className="self-end">
                        {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Appliquer'}
                    </Button>
                </div>
                 {promoMessage && <p className="text-sm text-green-600 mt-2">{promoMessage}</p>}
                <Separator className="my-6" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Sous-total</p>
                        <p>{formatPrice(totalPrice)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Livraison</p>
                        <p>{currency.code === 'MGA' ? `${shippingCost.toLocaleString('fr-FR')} Ar` : `${shippingCost.toFixed(2)} €`}</p>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                          <p>Réduction</p>
                          <p>-{formatPrice(appliedDiscount)}</p>
                      </div>
                    )}
                </div>
                <Separator className="my-6" />
                 <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{currency.code === 'MGA' ? `${Math.round(finalTotal).toLocaleString('fr-FR')} Ar` : `${finalTotal.toFixed(2)} €`}</p>
                </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
