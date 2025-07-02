'use client'

import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect } from 'react'
import { useFormState, useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateProduct } from "@/app/actions/productActions"
import ImageUpload from "@/components/ImageUpload"
import type { OurProduct, ICategory } from "@/types"
import { Switch } from "@/components/ui/switch"


const initialState = {
    error: null,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button size="sm" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les modifications
        </Button>
    )
}

interface EditProductPageClientProps {
    product: OurProduct;
    categories: ICategory[];
}

export default function EditProductPageClient({ product, categories }: EditProductPageClientProps) {
  const { toast } = useToast()
  
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useFormState(updateProductWithId, initialState);

  useEffect(() => {
    if (state?.error) {
        let description = "Une erreur est survenue. Veuillez vérifier les champs saisis.";
        if (typeof state.error === 'string') {
            description = state.error;
        } else if (typeof state.error === 'object' && state.error !== null) {
            const errorMessages = Object.values(state.error as Record<string, string[]>).flat().join(' ');
            if(errorMessages) description = errorMessages;
        }

      toast({
        title: "Erreur de mise à jour",
        description: description,
        variant: "destructive",
      })
    }
  }, [state, toast])

  const categoryId = typeof product.category === 'object' && product.category !== null ? (product.category as ICategory).id : product.category;

  return (
    <form action={formAction} className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin/products">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Retour</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Modifier le Produit
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/products">Annuler</Link>
                </Button>
                <SubmitButton />
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Détails du produit</CardTitle>
                <CardDescription>
                    Modifiez les informations principales de votre produit.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full"
                        defaultValue={product.name}
                        required
                    />
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="description">Description courte</Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={product.description}
                        className="min-h-24"
                    />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="detailed-description">Description détaillée</Label>
                        <Textarea
                            id="detailed-description"
                            name="detailed-description"
                            defaultValue={product.detailedDescription}
                            className="min-h-32"
                        />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Images du produit</CardTitle>
                <CardDescription>
                    Modifiez les images de votre produit.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                         <div className="grid gap-3">
                            <Label>Image de la carte (vitrine)</Label>
                            <ImageUpload id="image-url-upload" name="image-url" initialUrl={product.imageUrl} />
                         </div>
                         <div className="grid gap-3">
                            <Label>Image principale (page produit)</Label>
                            <ImageUpload id="main-image-url-upload" name="main-image-url" initialUrl={product.mainImageUrl} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Vignette 1</Label>
                                <ImageUpload id="thumbnail1-url-upload" name="thumbnail1-url" initialUrl={product.thumbnailImageUrl1} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Vignette 2</Label>
                                <ImageUpload id="thumbnail2-url-upload" name="thumbnail2-url" initialUrl={product.thumbnailImageUrl2} />
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
             <Card>
                <CardHeader>
                    <CardTitle>Organisation</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="grid gap-3">
                        <Label htmlFor="category">Catégorie</Label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={categoryId}
                            required
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Sélectionner...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-3 pt-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="featured" name="featured" defaultChecked={product.featured} />
                            <Label htmlFor="featured">Mettre en avant</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Le produit apparaîtra sur la page d'accueil. Limité à 5 produits.
                        </p>
                    </div>
                </CardContent>
             </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Prix et Inventaire</CardTitle>
                     <CardDescription>Le statut est automatiquement mis à jour en fonction de la valeur du stock.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="status">Statut actuel</Label>
                            <Input
                                id="status"
                                value={product.stock > 0 ? 'Actif' : 'En rupture'}
                                disabled
                            />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="price">Prix (€)</Label>
                            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sku">SKU (Unité de gestion de stock)</Label>
                            <Input id="sku" name="sku" type="text" defaultValue={product.sku} required />
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products">Annuler</Link>
            </Button>
            <SubmitButton />
        </div>
    </form>
  )
}
