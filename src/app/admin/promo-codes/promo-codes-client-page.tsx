
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { MoreHorizontal, Trash2, Pencil, Loader2, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { addPromoCode, updatePromoCode, deletePromoCode } from '@/app/actions/promoCodeActions';
import type { IPromoCode } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const SubmitButton = ({ children }: { children: React.ReactNode }) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    )
}

function PromoCodeForm({ promoCode, onDone }: { promoCode?: IPromoCode, onDone: () => void }) {
    const { toast } = useToast();
    const action = promoCode ? updatePromoCode.bind(null, promoCode.id) : addPromoCode;
    const [state, formAction] = useFormState(action, { error: null, success: null });
    const [expiresAt, setExpiresAt] = useState<Date | undefined>(promoCode?.expiresAt ? new Date(promoCode.expiresAt) : undefined);

    useEffect(() => {
        if (state.error) {
            const errorMessage = typeof state.error === 'string' 
                ? state.error 
                : Object.values(state.error).flat().join(' ');
            toast({ title: 'Erreur', description: errorMessage, variant: 'destructive' });
        }
        if (state.success) {
            toast({ title: 'Succès', description: state.success });
            onDone();
        }
    }, [state, toast, onDone]);

    return (
        <form action={formAction} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input id="code" name="code" defaultValue={promoCode?.code} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountType" className="text-right">Type</Label>
                <Select name="discountType" defaultValue={promoCode?.discountType}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixe (€)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountValue" className="text-right">Valeur</Label>
                <Input id="discountValue" name="discountValue" type="number" step="0.01" defaultValue={promoCode?.discountValue} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiresAt" className="text-right">Expire le</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full col-span-3 justify-start text-left font-normal", !expiresAt && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expiresAt ? format(expiresAt, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={expiresAt} onSelect={setExpiresAt} initialFocus />
                    </PopoverContent>
                </Popover>
                <input type="hidden" name="expiresAt" value={expiresAt?.toISOString() || ''} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minPurchase" className="text-right">Achat min.</Label>
                <Input id="minPurchase" name="minPurchase" type="number" step="0.01" defaultValue={promoCode?.minPurchase || 0} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usageLimit" className="text-right">Limite d'util.</Label>
                <Input id="usageLimit" name="usageLimit" type="number" defaultValue={promoCode?.usageLimit || ''} placeholder="Aucune limite" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Actif</Label>
                <Switch id="isActive" name="isActive" defaultChecked={promoCode?.isActive ?? true} />
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={onDone}>Annuler</Button>
                <SubmitButton>{promoCode ? 'Sauvegarder' : 'Ajouter'}</SubmitButton>
            </DialogFooter>
        </form>
    );
}

export default function PromoCodesClientPage({ promoCodes }: { promoCodes: IPromoCode[] }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [isAddEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [codeToEdit, setCodeToEdit] = useState<IPromoCode | null>(null);
    const [codeToDelete, setCodeToDelete] = useState<IPromoCode | null>(null);

    const handleDelete = async () => {
        if (!codeToDelete) return;
        startTransition(async () => {
            const result = await deletePromoCode(codeToDelete.id);
            if (result.success) {
                toast({ title: 'Succès', description: result.success });
            } else {
                toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
            }
            setCodeToDelete(null);
        });
    };

    const getDiscountValueString = (code: IPromoCode) => {
        return code.discountType === 'fixed' ? `${code.discountValue.toFixed(2)} €` : `${code.discountValue}%`;
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Codes Promo</CardTitle>
                        <CardDescription>Gérez les réductions pour vos clients.</CardDescription>
                    </div>
                    <Dialog open={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un Code</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter un nouveau code promo</DialogTitle>
                            </DialogHeader>
                            <PromoCodeForm onDone={() => setAddEditDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {/* Desktop Table */}
                    <ScrollArea className="h-[calc(100vh-250px)] hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Réduction</TableHead>
                                    <TableHead>Utilisation</TableHead>
                                    <TableHead>Expire le</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {promoCodes.map((code) => (
                                    <TableRow key={code.id} className={!code.isActive ? 'opacity-60' : ''}>
                                        <TableCell className="font-medium">{code.code}</TableCell>
                                        <TableCell>{getDiscountValueString(code)}</TableCell>
                                        <TableCell>{code.timesUsed} / {code.usageLimit || '∞'}</TableCell>
                                        <TableCell>{code.expiresAt ? format(new Date(code.expiresAt), 'dd/MM/yyyy') : 'Jamais'}</TableCell>
                                        <TableCell>
                                            <Badge variant={code.isActive ? 'default' : 'secondary'}>{code.isActive ? 'Actif' : 'Inactif'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setCodeToEdit(code)} className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setCodeToDelete(code)} className="text-destructive focus:text-destructive cursor-pointer">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    
                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {promoCodes.map((code) => (
                             <Card key={code.id} className={!code.isActive ? 'opacity-60' : ''}>
                                <CardHeader className="p-4 flex flex-row items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{code.code}</CardTitle>
                                        <CardDescription>{getDiscountValueString(code)} de réduction</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setCodeToEdit(code)}><Pencil className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setCodeToDelete(code)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                    <p>Utilisation: {code.timesUsed} / {code.usageLimit || '∞'}</p>
                                    <p>Expire: {code.expiresAt ? format(new Date(code.expiresAt), 'dd/MM/yyyy') : 'Jamais'}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                     <Badge variant={code.isActive ? 'default' : 'secondary'}>{code.isActive ? 'Actif' : 'Inactif'}</Badge>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </CardContent>
            </Card>

            <Dialog open={!!codeToEdit} onOpenChange={(open) => !open && setCodeToEdit(null)}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Modifier le code promo</DialogTitle>
                        <DialogDescription>Ajustez les détails du code "{codeToEdit?.code}".</DialogDescription>
                    </DialogHeader>
                    {codeToEdit && <PromoCodeForm promoCode={codeToEdit} onDone={() => setCodeToEdit(null)} />}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!codeToDelete} onOpenChange={(open) => !open && setCodeToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le code promo "{codeToDelete?.code}" sera supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

