'use client'

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useActionState } from 'react'

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
import { addProduct } from "@/app/actions/productActions"
import ImageUpload from "@/components/ImageUpload"

const initialState = {
    error: null,
};

export default function NewProductPageClient() {
  const { toast } = useToast()
  const [state, formAction] = useActionState(addProduct, initialState)

  useEffect(() => {
    if (state?.error) {
        let description = "Une erreur est survenue. Veuillez vérifier les champs saisis.";
        if (typeof state.error === 'string') {
            description = state.error;
        } else if (typeof state.error === 'object' && state.error !== null) {
            // It's likely the Zod error object
            const errorMessages = Object.values(state.error as Record<string, string[]>).flat().join(' ');
            if(errorMessages) description = errorMessages;
        }

      toast({
        title: "Erreur lors de l'ajout",
        description: description,
        variant: "destructive",
      })
    }
  }, [state, toast])

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
                Nouveau Produit
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/products">Annuler</Link>
                </Button>
                <Button size="sm" type="submit">Sauvegarder</Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Détails du produit</CardTitle>
                <CardDescription>
                    Entrez les informations principales de votre produit.
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
                        placeholder="Ex: Collier Élégance"
                        required
                    />
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="description">Description courte</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Un collier fin et élégant pour toutes les occasions."
                        className="min-h-24"
                    />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="detailed-description">Description détaillée</Label>
                        <Textarea
                            id="detailed-description"
                            name="detailed-description"
                            placeholder="Fabriqué en argent 925 et orné d'une pierre de lune..."
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
                    Téléversez les images de votre produit.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                         <div className="grid gap-3">
                            <Label>Image de la carte (vitrine)</Label>
                            <ImageUpload id="image-url-upload" name="image-url" />
                         </div>
                         <div className="grid gap-3">
                            <Label>Image principale (page produit)</Label>
                            <ImageUpload id="main-image-url-upload" name="main-image-url" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Vignette 1</Label>
                                <ImageUpload id="thumbnail1-url-upload" name="thumbnail1-url" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Vignette 2</Label>
                                <ImageUpload id="thumbnail2-url-upload" name="thumbnail2-url" />
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Statut du produit</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                    <Label htmlFor="status">Statut</Label>
                    <select
                        id="status"
                        name="status"
                        defaultValue="active"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <option value="draft">Brouillon</option>
                        <option value="active">Actif</option>
                    </select>
                    </div>
                </div>
                </CardContent>
            </Card>
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
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Bague">Bague</option>
                            <option value="Collier">Collier</option>
                            <option value="Bracelet">Bracelet</option>
                            <option value="Boucles d'oreilles">Boucles d'oreilles</option>
                            <option value="Pendentif">Pendentif</option>
                            <option value="Montre">Montre</option>
                        </select>
                    </div>
                </CardContent>
             </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Prix et Inventaire</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                         <div className="grid gap-3">
                            <Label htmlFor="price">Prix (€)</Label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="199.00" required />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name="stock" type="number" placeholder="25" required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sku">SKU (Unité de gestion de stock)</Label>
                            <Input id="sku" name="sku" type="text" placeholder="PALA-001" required />
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
            <Button size="sm" type="submit">Sauvegarder</Button>
        </div>
    </form>
  )
}
