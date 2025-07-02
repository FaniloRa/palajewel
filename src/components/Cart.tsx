
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, cartCount, totalPrice } = useCart();

  return (
    <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-foreground">Panier ({cartCount})</h2>
                </div>

                <div className="mt-8">
                    {cart.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">Votre panier est vide.</p>
                            <SheetClose asChild>
                                <Button variant="link" asChild className="mt-2">
                                    <Link href="/shop">Continuer vos achats</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-250px)] pr-4 -mr-4">
                            <ul role="list" className="divide-y divide-border">
                                {cart.map(item => (
                                    <li key={item.product.id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                width={96}
                                                height={96}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-foreground">
                                                    <h3>
                                                        <Link href={`/produits/${item.product.id}`}>{item.product.name}</Link>
                                                    </h3>
                                                    <p className="ml-4">{(item.product.price * item.quantity).toFixed(2)} €</p>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">{item.product.price.toFixed(2)} €</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                                    <span>{item.quantity}</span>
                                                    <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                                </div>
                                                <div className="flex">
                                                    <Button variant="ghost" type="button" className="font-medium text-destructive hover:text-destructive/80 p-1 h-auto" onClick={() => removeFromCart(item.product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>

        {cart.length > 0 && (
            <div className="border-t border-border px-6 py-4">
                <div className="flex justify-between text-base font-medium text-foreground">
                    <p>Sous-total</p>
                    <p>{totalPrice.toFixed(2)} €</p>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">Taxes et frais de port calculés à la caisse.</p>
                <div className="mt-6">
                    <Button size="lg" className="w-full">
                        Passer à la caisse
                    </Button>
                </div>
                <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                    <p>
                        ou{' '}
                        <SheetClose asChild>
                            <Button variant="link" className="p-0 h-auto">
                                Continuer vos achats
                                <span aria-hidden="true"> &rarr;</span>
                            </Button>
                        </SheetClose>
                    </p>
                </div>
            </div>
        )}
    </div>
  )
}
