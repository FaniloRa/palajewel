
'use client'

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Plus, Minus, Trash2, Wallet, CreditCard } from 'lucide-react';

import { ourProductsData } from '@/data/ourProductsData';
import type { OurProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


interface CartItem {
  product: OurProduct;
  quantity: number;
}

export default function NewOrderPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return ourProductsData.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddToCart = (product: OurProduct) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.20, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleCreateOrder = () => {
    if (cart.length === 0) {
        toast({ title: 'Erreur', description: 'Le panier est vide.', variant: 'destructive' });
        return;
    }
     if (!customerName || !customerEmail) {
      toast({ title: 'Erreur', description: 'Veuillez saisir les informations du client.', variant: 'destructive' });
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const handleFinalizeOrder = (paymentMethod: 'cash' | 'visa') => {
    // In a real app, you would send this data to your backend
    console.log({
        customer: { name: customerName, email: customerEmail },
        items: cart,
        summary: { subtotal, tax, total },
        paymentMethod
    });

    toast({ title: 'Succès', description: `La commande a été créée et payée par ${paymentMethod === 'cash' ? 'espèce' : 'Visa'}.` });
    
    // Reset state
    setCart([]);
    setCustomerName('');
    setCustomerEmail('');
    setIsPaymentDialogOpen(false);
  };


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
        {/* Product List Column */}
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Produits</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un produit..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <ScrollArea className="h-[calc(100vh-220px)] p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative aspect-square w-full">
                          <Image src={product.imageUrl} alt={product.name} fill style={{objectFit: 'cover'}} data-ai-hint={product.dataAiHint} />
                      </div>
                      <div className="p-4">
                          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.price.toFixed(2)} €</p>
                          <Button size="sm" className="w-full mt-2" onClick={() => handleAddToCart(product)}>
                              Ajouter
                          </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Column */}
        <div className="md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Détails de la Commande</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                  <Label htmlFor="customer-name">Nom du client</Label>
                  <Input id="customer-name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div>
                  <Label htmlFor="customer-email">Email du client</Label>
                  <Input id="customer-email" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
              </div>
              <Separator />
              <h4 className="font-medium">Articles</h4>
              <ScrollArea className="h-[calc(100vh-550px)]">
                  <div className="space-y-4 pr-4">
                  {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Le panier est vide.</p>
                  ) : (
                      cart.map(item => (
                          <div key={item.product.id} className="flex items-center gap-4">
                              <Image src={item.product.imageUrl} alt={item.product.name} width={48} height={48} className="rounded-md object-cover" data-ai-hint={item.product.dataAiHint} />
                              <div className="flex-grow">
                                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.product.price.toFixed(2)} €</p>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                  <span>{item.quantity}</span>
                                  <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                              </div>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground" onClick={() => handleRemoveFromCart(item.product.id)}>
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                      ))
                  )}
                  </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-auto !pt-6">
                  <div className="w-full space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span>Sous-total</span>
                          <span>{subtotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                          <span>TVA (20%)</span>
                          <span>{tax.toFixed(2)} €</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                          <span>Total</span>
                          <span>{total.toFixed(2)} €</span>
                      </div>
                  </div>
                  <Button size="lg" className="w-full" onClick={handleCreateOrder}>Valider la commande</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sélectionner le moyen de paiement</AlertDialogTitle>
            <AlertDialogDescription>
              Comment le client souhaite-t-il régler la commande de {total.toFixed(2)} € ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 pt-4 sm:flex-col sm:justify-center">
            <Button size="lg" onClick={() => handleFinalizeOrder('visa')}>
              <CreditCard className="mr-2 h-5 w-5" /> Payer par Visa
            </Button>
            <Button size="lg" variant="secondary" onClick={() => handleFinalizeOrder('cash')}>
              <Wallet className="mr-2 h-5 w-5" /> Payer en espèce
            </Button>
            <AlertDialogCancel className="mt-2">Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
