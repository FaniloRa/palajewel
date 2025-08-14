'use client'

import Image from 'next/image'
import { MoreHorizontal, PlusCircle, Trash2, Pencil, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useState, useTransition, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { OurProduct } from '@/types'
import { deleteProduct } from '@/app/actions/productActions'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ProductsPageClientProps {
  products: OurProduct[];
}

export default function ProductsPageClient({ products: initialProducts }: ProductsPageClientProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [productToDelete, setProductToDelete] = useState<OurProduct | null>(null);

  const searchTerm = searchParams.get('search') || '';

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return initialProducts;
    return initialProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialProducts]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    startTransition(async () => {
      const result = await deleteProduct(productToDelete.id);
      if (result.success) {
        // We rely on server revalidation to update the list, so no client-side filtering needed here.
        // A page refresh would show the changes. The action itself triggers revalidation.
        toast({ title: 'Succès', description: 'Le produit a été supprimé.' });
      } else {
        toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
      }
      setProductToDelete(null);
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Produits</CardTitle>
                  <CardDescription>
                  Gérez vos produits et consultez leurs performances de vente.
                  </CardDescription>
              </div>
              <Button asChild size="sm" className="h-8 gap-1">
                <Link href="/admin/products/new">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Ajouter un Produit
                  </span>
                </Link>
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead className="hidden md:table-cell">Créé le</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchTerm ? `Aucun produit trouvé pour "${searchTerm}".` : "Aucun produit."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                <TableRow key={product.id} className={cn(product.status === 'draft' && 'opacity-60')}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.imageUrl}
                      width="64"
                      data-ai-hint={product.dataAiHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{product.name}</span>
                      {product.featured && <Badge variant="secondary">En avant</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'active' ? 'outline' : 'destructive'}>
                      {product.status === 'active' ? 'Actif' : 'En rupture'}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.price.toFixed(2)} €</TableCell>
                  <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {/* @ts-ignore */}
                    {product.createdAt ? format(new Date(product.createdAt), 'yyyy-MM-dd') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/admin/products/view/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> Voir les détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setProductToDelete(product)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Affichage de <strong>1-{filteredProducts.length}</strong> sur <strong>{initialProducts.length}</strong> produits
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
