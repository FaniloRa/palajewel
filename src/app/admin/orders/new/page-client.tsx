
'use client'

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Plus, Minus, Trash2, Wallet, CreditCard, Printer, X, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createOrder } from '@/app/actions/orderActions';


interface CartItem {
  product: OurProduct;
  quantity: number;
}

interface FinalizedOrder {
  _id: string;
  customer: { name: string; email: string };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
  summary: { subtotal: number; tax: number; total: number; };
  paymentMethod: 'cash' | 'visa';
  createdAt: string;
}

interface NewOrderClientPageProps {
    products: OurProduct[];
}

export default function NewOrderClientPage({ products }: NewOrderClientPageProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCashConfirmationDialogOpen, setIsCashConfirmationDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  
  const [cashReceivedAmount, setCashReceivedAmount] = useState('');
  const [finalizedOrder, setFinalizedOrder] = useState<FinalizedOrder | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleAddToCart = (product: OurProduct) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          toast({ title: 'Stock insuffisant', description: `Vous ne pouvez pas ajouter plus de ${product.name}.`, variant: 'destructive'});
          return prevCart;
        }
      }
      if (product.stock > 0) {
        return [...prevCart, { product, quantity: 1 }];
      } else {
        toast({ title: 'Stock épuisé', description: `${product.name} est en rupture de stock.`, variant: 'destructive'});
        return prevCart;
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const productInCart = cart.find(item => item.product.id === productId)?.product;
    if(productInCart && quantity > productInCart.stock) {
      toast({ title: 'Stock insuffisant', description: `Il ne reste que ${productInCart.stock} ${productInCart.name} en stock.`, variant: 'destructive'});
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
  
  const processOrder = async (paymentMethod: 'cash' | 'visa') => {
    setIsLoading(true);
    const orderInput = {
        customer: { name: customerName, email: customerEmail },
        cart: cart, // Server action will handle this structure
        summary: { subtotal, tax, total },
        paymentMethod,
    };
    
    const result = await createOrder(orderInput);
    setIsLoading(false);
    
    if (result.error) {
        toast({ title: 'Erreur de commande', description: result.error, variant: 'destructive' });
        setIsPaymentDialogOpen(false);
        setIsCashConfirmationDialogOpen(false);
        return;
    }
    
    if (result.success && result.order) {
        setFinalizedOrder(result.order as FinalizedOrder);
        setIsPaymentDialogOpen(false);
        setIsCashConfirmationDialogOpen(false);
        setIsReceiptDialogOpen(true);
        toast({ title: 'Succès', description: `La commande a été validée avec paiement par ${paymentMethod === 'cash' ? 'espèce' : 'Visa'}.` });
    }
  }


  const handleConfirmPayment = (paymentMethod: 'cash' | 'visa') => {
    processOrder(paymentMethod);
  };

  const handleCashPayment = () => {
    const received = parseFloat(cashReceivedAmount);
    if (isNaN(received) || received < total) {
      toast({ title: 'Erreur', description: 'Le montant saisi est incorrect ou insuffisant.', variant: 'destructive' });
      return;
    }
    processOrder('cash');
  };

  const handleCloseAndReset = () => {
    setCart([]);
    setCustomerName('');
    setCustomerEmail('');
    setCashReceivedAmount('');
    setFinalizedOrder(null);
    setIsReceiptDialogOpen(false);
  };

  const handlePrintReceipt = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement) {
      html2canvas(receiptElement, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 297]
          });
          
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          const customerNameForFile = finalizedOrder?.customer.name.replace(/\s+/g, '_') || 'commande';
          pdf.save(`recu-${customerNameForFile}-${finalizedOrder?._id}.pdf`);
        });
    }
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
                          <Button 
                            size="sm" 
                            className="w-full mt-2" 
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            {product.stock > 0 ? 'Ajouter' : 'Épuisé'}
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

      {/* Payment Method Dialog */}
      <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sélectionner le moyen de paiement</AlertDialogTitle>
            <AlertDialogDescription>
              Comment le client souhaite-t-il régler la commande de {total.toFixed(2)} € ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 pt-4 sm:flex-col sm:justify-center">
            <Button size="lg" onClick={() => handleConfirmPayment('visa')} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" /> Payer par Visa
                </>
              )}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => { setIsPaymentDialogOpen(false); setIsCashConfirmationDialogOpen(true); }} disabled={isLoading}>
              <Wallet className="mr-2 h-5 w-5" /> Payer en espèce
            </Button>
            <AlertDialogCancel className="mt-2" disabled={isLoading}>Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cash Confirmation Dialog */}
      <AlertDialog open={isCashConfirmationDialogOpen} onOpenChange={setIsCashConfirmationDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Paiement en espèce</AlertDialogTitle>
                <AlertDialogDescription>
                    Le montant total est de <strong>{total.toFixed(2)} €</strong>. Veuillez saisir le montant reçu du client.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
                <Label htmlFor="cash-received">Montant reçu</Label>
                <Input
                    id="cash-received"
                    type="number"
                    placeholder={total.toFixed(2)}
                    value={cashReceivedAmount}
                    onChange={(e) => setCashReceivedAmount(e.target.value)}
                    className="text-lg text-right"
                    min={total.toString()}
                    disabled={isLoading}
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCashReceivedAmount('')} disabled={isLoading}>Annuler</AlertDialogCancel>
                <Button onClick={handleCashPayment} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Traitement...' : 'Payer'}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={(open) => !open && handleCloseAndReset()}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="sr-only">Reçu de la commande</DialogTitle>
            <DialogDescription className="sr-only">
              Aperçu du reçu de la commande finalisée, prêt à être imprimé.
            </DialogDescription>
          </DialogHeader>
           {finalizedOrder && (
              <div id="receipt-content" className="text-sm font-mono p-6 bg-white text-black">
                  <div className="text-center mb-4">
                      <h3 className="text-lg font-bold">Pala Jewelry</h3>
                      <p>10 Rue Ratsimilaho, Antananarivo</p>
                      <p>{new Date(finalizedOrder.createdAt).toLocaleString('fr-FR')}</p>
                      <p>Reçu No: {finalizedOrder._id}</p>
                  </div>
                  <div className="mb-4">
                      <p><strong>Client:</strong> {finalizedOrder.customer.name}</p>
                  </div>
                  <div className="border-t border-b border-dashed border-black py-2 my-2">
                      {finalizedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start gap-2">
                              <div className="flex-grow">
                                  <p>{item.name}</p>
                                  <p className="text-xs">
                                      {item.quantity} x {item.price.toFixed(2)}€
                                  </p>
                              </div>
                              <p className="flex-shrink-0 text-right">{(item.quantity * item.price).toFixed(2)}€</p>
                          </div>
                      ))}
                  </div>
                  <div className="space-y-1 mt-2">
                        <div className="flex justify-between">
                          <p>Sous-total</p>
                          <p>{finalizedOrder.summary.subtotal.toFixed(2)}€</p>
                      </div>
                      <div className="flex justify-between">
                          <p>TVA (20%)</p>
                          <p>{finalizedOrder.summary.tax.toFixed(2)}€</p>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-dashed border-black pt-2 mt-2">
                          <p>TOTAL</p>
                          <p>{finalizedOrder.summary.total.toFixed(2)}€</p>
                      </div>
                  </div>
                    <div className="text-center mt-6">
                      <p>Payé par: <strong>{finalizedOrder.paymentMethod === 'cash' ? 'Espèce' : 'Visa'}</strong></p>
                      <p className="mt-4 text-xs">Merci pour votre achat !</p>
                  </div>
              </div>
          )}
          <DialogFooter className="sm:justify-between gap-2 p-4 border-t bg-muted">
              <Button variant="ghost" onClick={handleCloseAndReset}>
                  <X className="mr-2 h-4 w-4" /> Fermer
              </Button>
              <Button onClick={handlePrintReceipt}>
                  <Printer className="mr-2 h-4 w-4" /> Imprimer le reçu
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
