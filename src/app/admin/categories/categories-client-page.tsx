
'use client';

import { useState, useTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { MoreHorizontal, Trash2, Pencil, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addCategory, updateCategory, deleteCategory } from '@/app/actions/categoryActions';
import type { ICategory } from '@/models/Category';

interface CategoriesClientPageProps {
  categories: ICategory[];
}

const AddCategoryButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ajouter
        </Button>
    )
}

export default function CategoriesClientPage({ categories: initialCategories }: CategoriesClientPageProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);

  // State for modals
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [addState, addFormAction] = useActionState(addCategory, { error: null, success: null });

  useEffect(() => {
    if (addState.error) {
        toast({ title: 'Erreur', description: addState.error, variant: 'destructive' });
    }
    if (addState.success) {
        toast({ title: 'Succès', description: addState.success });
        // We rely on revalidation triggered by the server action
        const form = document.getElementById('add-category-form') as HTMLFormElement;
        form?.reset();
    }
  }, [addState, toast]);

  const handleEditCategory = () => {
    if (!categoryToEdit || !editedName) return;

    startTransition(async () => {
      const result = await updateCategory(categoryToEdit.id, editedName);
      if (result.success) {
        toast({ title: 'Succès', description: result.success });
        setCategories(prev =>
          prev.map(cat => (cat.id === categoryToEdit.id ? { ...cat, name: editedName } : cat))
        );
        closeEditModal();
      } else {
        toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
      }
    });
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    startTransition(async () => {
      const result = await deleteCategory(categoryToDelete.id);
      if (result.success) {
        toast({ title: 'Succès', description: result.success });
        setCategories(prev => prev.filter(p => p.id !== categoryToDelete.id));
      } else {
        toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
      }
      setCategoryToDelete(null);
    });
  };

  const openEditModal = (category: ICategory) => {
    setCategoryToEdit(category);
    setEditedName(category.name);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCategoryToEdit(null);
    setEditedName('');
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Liste des Catégories</CardTitle>
            <CardDescription>Gérez les catégories de vos produits.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Date de Création</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(category.createdAt!).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditModal(category)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCategoryToDelete(category)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter une Catégorie</CardTitle>
            <CardDescription>
              Créez une nouvelle catégorie pour organiser vos produits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-category-form" action={addFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Bagues"
                  required
                />
                 {addState?.error && <p className="text-sm text-destructive">{addState.error}</p>}
              </div>
              <AddCategoryButton />
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La catégorie "{categoryToDelete?.name}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez le nom de la catégorie "{categoryToEdit?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-name">Nouveau nom</Label>
            <Input
              id="edit-name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal} disabled={isPending}>
              Annuler
            </Button>
            <Button onClick={handleEditCategory} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
