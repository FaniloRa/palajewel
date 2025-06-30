'use client'

import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'

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
import type { OurProduct } from "@/types"

// A simple component to display an image in a read-only view
function ImageViewer({ url, alt }: { url?: string; alt: string }) {
    return (
        <div className="relative w-full h-48 rounded-md overflow-hidden border bg-muted">
            {url ? (
                <Image src={url} alt={alt} fill style={{ objectFit: 'cover' }} />
            ) : (
                 <div className="flex items-center justify-center h-full">
                    <span className="text-sm text-muted-foreground">Aucune image</span>
                </div>
            )}
        </div>
    );
}

interface ViewProductPageClientProps {
    product: OurProduct;
}

export default function ViewProductPageClient({ product }: ViewProductPageClientProps) {

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin/products">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Retour</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Détails du Produit
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/edit/${product.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                    </Link>
                </Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Détails du produit</CardTitle>
                <CardDescription>
                    Informations principales du produit.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue={product.name}
                        disabled
                    />
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="description">Description courte</Label>
                    <Textarea
                        id="description"
                        defaultValue={product.description}
                        className="min-h-24"
                        disabled
                    />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="detailed-description">Description détaillée</Label>
                        <Textarea
                            id="detailed-description"
                            defaultValue={product.detailedDescription}
                            className="min-h-32"
                            disabled
                        />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Images du produit</CardTitle>
                <CardDescription>
                    Images du produit.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                         <div className="grid gap-3">
                            <Label>Image de la carte (vitrine)</Label>
                            <ImageViewer url={product.imageUrl} alt={`${product.name} - image de la carte`} />
                         </div>
                         <div className="grid gap-3">
                            <Label>Image principale (page produit)</Label>
                             <ImageViewer url={product.mainImageUrl} alt={`${product.name} - image principale`} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Vignette 1</Label>
                                <ImageViewer url={product.thumbnailImageUrl1} alt={`${product.name} - vignette 1`} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Vignette 2</Label>
                                <ImageViewer url={product.thumbnailImageUrl2} alt={`${product.name} - vignette 2`} />
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
                    <Input
                        id="status"
                        defaultValue={product.status === 'active' ? 'Actif' : 'Brouillon'}
                        disabled
                    />
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
                        <Input
                            id="category"
                            defaultValue={product.category}
                            disabled
                        />
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
                            <Input id="price" type="number" defaultValue={product.price} disabled />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" defaultValue={product.stock} disabled />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sku">SKU (Unité de gestion de stock)</Label>
                            <Input id="sku" type="text" defaultValue={product.sku} disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
             <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/products/edit/${product.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                </Link>
            </Button>
        </div>
    </div>
  )
}
