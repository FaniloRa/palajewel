
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { MoreHorizontal, Trash2, Pencil, Loader2, PlusCircle, UserCog } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addUser, updateUser, deleteUser } from '@/app/actions/userActions';
import type { IUser } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
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

function UserForm({ user, onDone }: { user?: IUser, onDone: () => void }) {
    const { toast } = useToast();
    const action = user ? updateUser.bind(null, user.id) : addUser;
    const [state, formAction] = useFormState(action, { error: null, success: null });

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
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email} className="col-span-3" required disabled={!!user} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Mot de passe</Label>
                <Input id="password" name="password" type="password" className="col-span-3" placeholder={user ? "Laisser vide pour ne pas changer" : ""} required={!user} />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rôle</Label>
                <Select name="role" defaultValue={user?.role} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="caissier">Caissier</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={onDone}>Annuler</Button>
                <SubmitButton>{user ? 'Sauvegarder' : 'Ajouter'}</SubmitButton>
            </DialogFooter>
        </form>
    );
}

export default function UsersClientPage({ users }: { users: IUser[] }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [isAddEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

    const handleDelete = async () => {
        if (!userToDelete) return;
        startTransition(async () => {
            const result = await deleteUser(userToDelete.id);
            if (result.success) {
                toast({ title: 'Succès', description: result.success });
            } else {
                toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
            }
            setUserToDelete(null);
        });
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gestion des Utilisateurs</CardTitle>
                        <CardDescription>Ajoutez, modifiez ou supprimez des utilisateurs.</CardDescription>
                    </div>
                    <Dialog open={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
                        <DialogTrigger asChild>
                             <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un utilisateur</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                            </DialogHeader>
                            <UserForm onDone={() => setAddEditDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {/* Desktop View */}
                    <ScrollArea className="h-[calc(100vh-250px)] hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead className="hidden md:table-cell">Créé le</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{format(new Date(user.createdAt!), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setUserToEdit(user)} className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setUserToDelete(user)} className="text-destructive focus:text-destructive cursor-pointer">
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
                    
                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {users.map((user) => (
                            <Card key={user.id}>
                                <CardHeader className="p-4 flex flex-row items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">{user.email}</CardTitle>
                                        <CardDescription>Créé le: {format(new Date(user.createdAt!), 'dd/MM/yyyy')}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setUserToEdit(user)}><Pencil className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setUserToDelete(user)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardFooter className="p-4 pt-0">
                                     <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                        {user.role}
                                    </Badge>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </CardContent>
            </Card>

            <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Modifier l'utilisateur</DialogTitle>
                        <DialogDescription>Ajustez les détails pour {userToEdit?.email}.</DialogDescription>
                    </DialogHeader>
                    {userToEdit && <UserForm user={userToEdit} onDone={() => setUserToEdit(null)} />}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L'utilisateur "{userToDelete?.email}" sera supprimé.
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

