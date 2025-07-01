
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Printer, FileText, Gem } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import type { IOrder } from '@/models/Order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface OrderDetailPageClientProps {
    order: IOrder;
}

export default function OrderDetailPageClient({ order }: OrderDetailPageClientProps) {
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    const handlePrint = (contentId: string, format: 'receipt' | 'invoice') => {
        const element = document.getElementById(contentId);
        if (element) {
            html2canvas(element, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                
                let pdf;
                if (format === 'receipt') {
                    pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 297] });
                } else { // invoice
                    pdf = new jsPDF('p', 'mm', 'a4');
                }

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${format}-${order.customer.name.replace(/\s+/g, '_')}-${order._id}.pdf`);
            });
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/admin/orders">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Retour aux commandes</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Détails de la Commande
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" onClick={() => setIsReceiptOpen(true)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Réimprimer le Ticket
                    </Button>
                    <Button onClick={() => setIsInvoiceOpen(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Imprimer la Facture
                    </Button>
                </div>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Commande #{order._id.substring(order._id.length - 7).toUpperCase()}</CardTitle>
                        <CardDescription>
                            Date: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                        </CardDescription>
                    </div>
                    <div className="text-right">
                         <div className="font-semibold">{order.customer.name}</div>
                         <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                                <TableHead>Produit</TableHead>
                                <TableHead className="text-center">Quantité</TableHead>
                                <TableHead className="text-right">Prix Unitaire</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.price.toFixed(2)} €</TableCell>
                                    <TableCell className="text-right">{(item.price * item.quantity).toFixed(2)} €</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-end pt-6">
                     <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span>{order.summary.subtotal.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">TVA (20%)</span>
                            <span>{order.summary.tax.toFixed(2)} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>{order.summary.total.toFixed(2)} €</span>
                        </div>
                     </div>
                </CardFooter>
            </Card>

            {/* Receipt Dialog */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-sm p-0">
                    <div id="receipt-content" className="text-sm font-mono p-6 bg-white text-black">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold">Pala Jewelry</h3>
                            <p>10 Rue Ratsimilaho, Antananarivo</p>
                            <p>{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
                            <p>Reçu No: {order._id}</p>
                        </div>
                        <div className="mb-4">
                            <p><strong>Client:</strong> {order.customer.name}</p>
                        </div>
                        <div className="border-t border-b border-dashed border-black py-2 my-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-start gap-2">
                                    <div className="flex-grow">
                                        <p>{item.name}</p>
                                        <p className="text-xs">{item.quantity} x {item.price.toFixed(2)}€</p>
                                    </div>
                                    <p className="flex-shrink-0 text-right">{(item.quantity * item.price).toFixed(2)}€</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1 mt-2">
                            <div className="flex justify-between"><p>Sous-total</p><p>{order.summary.subtotal.toFixed(2)}€</p></div>
                            <div className="flex justify-between"><p>TVA (20%)</p><p>{order.summary.tax.toFixed(2)}€</p></div>
                            <div className="flex justify-between font-bold text-base border-t border-dashed border-black pt-2 mt-2"><p>TOTAL</p><p>{order.summary.total.toFixed(2)}€</p></div>
                        </div>
                        <div className="text-center mt-6">
                            <p>Payé par: <strong>{order.paymentMethod === 'cash' ? 'Espèce' : 'Visa'}</strong></p>
                            <p className="mt-4 text-xs">Merci pour votre achat !</p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end gap-2 p-4 border-t bg-muted">
                        <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>Fermer</Button>
                        <Button onClick={() => handlePrint('receipt-content', 'receipt')}><Printer className="mr-2 h-4 w-4" /> Imprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Invoice Dialog */}
            <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
                <DialogContent className="max-w-4xl p-0">
                    <div id="invoice-content" className="p-10 bg-white text-black font-sans">
                        <header className="flex justify-between items-start mb-10">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                     <Gem className="h-8 w-8 text-slate-800" />
                                     <span className="text-3xl font-bold text-slate-800">Pala Jewelry</span>
                                </div>
                                <p>10 Rue Ratsimilaho</p>
                                <p>Antananarivo, 101</p>
                                <p>Madagascar</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-4xl font-bold text-slate-800 mb-2">FACTURE</h1>
                                <p><strong>Numéro:</strong> {order._id}</p>
                                <p><strong>Date:</strong> {format(new Date(order.createdAt), 'dd/MM/yyyy')}</p>
                            </div>
                        </header>
                        <section className="mb-10">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Facturé à</h2>
                            <p className="font-medium">{order.customer.name}</p>
                            <p>{order.customer.email}</p>
                        </section>
                        <section>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold">Description</th>
                                        <th className="p-3 text-sm font-semibold text-center">Qté</th>
                                        <th className="p-3 text-sm font-semibold text-right">Prix Unitaire</th>
                                        <th className="p-3 text-sm font-semibold text-right">Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-right">{item.price.toFixed(2)} €</td>
                                        <td className="p-3 text-right">{(item.quantity * item.price).toFixed(2)} €</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                        <section className="flex justify-end mt-6">
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between"><span className="text-slate-600">Sous-total</span><span>{order.summary.subtotal.toFixed(2)} €</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">TVA (20%)</span><span>{order.summary.tax.toFixed(2)} €</span></div>
                                <div className="border-t my-2"></div>
                                <div className="flex justify-between text-xl font-bold"><span >TOTAL</span><span>{order.summary.total.toFixed(2)} €</span></div>
                            </div>
                        </section>
                        <footer className="mt-20 text-center text-xs text-slate-500 border-t pt-4">
                            <p>Payé par {order.paymentMethod === 'cash' ? 'Espèce' : 'Visa'}.</p>
                            <p>Merci de votre confiance. Pala Jewelry - contact@palajewelry.com</p>
                        </footer>
                    </div>
                    <DialogFooter className="sm:justify-end gap-2 p-4 border-t bg-muted">
                        <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>Fermer</Button>
                        <Button onClick={() => handlePrint('invoice-content', 'invoice')}><Printer className="mr-2 h-4 w-4" /> Imprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
