
'use client'

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"


export default function NewProductPage() {
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle form submission, e.g., send data to an API
        console.log("Form submitted")
        toast({
            title: "Produit ajouté",
            description: "Le nouveau produit a été sauvegardé avec succès.",
        })
        router.push("/admin/products")
    }

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
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
                        type="text"
                        className="w-full"
                        placeholder="Ex: Collier Élégance"
                    />
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="description">Description courte</Label>
                    <Textarea
                        id="description"
                        placeholder="Un collier fin et élégant pour toutes les occasions."
                        className="min-h-24"
                    />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="detailed-description">Description détaillée</Label>
                        <Textarea
                            id="detailed-description"
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
                    Ajoutez les URL des images de votre produit.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="image-url">Image de la carte (vitrine)</Label>
                            <Input id="image-url" type="text" placeholder="https://placehold.co/400x300.png" />
                         </div>
                         <div className="grid gap-2">
                            <Label htmlFor="main-image-url">Image principale (page produit)</Label>
                            <Input id="main-image-url" type="text" placeholder="https://placehold.co/600x600.png" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail1-url">Vignette 1</Label>
                                <Input id="thumbnail1-url" type="text" placeholder="https://placehold.co/300x300.png" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail2-url">Vignette 2</Label>
                                <Input id="thumbnail2-url" type="text" placeholder="https://placehold.co/300x300.png" />
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
                    <Select defaultValue="active">
                        <SelectTrigger id="status" aria-label="Sélectionner le statut">
                        <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <Select>
                            <SelectTrigger id="category" aria-label="Sélectionner la catégorie">
                                <SelectValue placeholder="Sélectionner la catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bague">Bague</SelectItem>
                                <SelectItem value="Collier">Collier</SelectItem>
                                <SelectItem value="Bracelet">Bracelet</SelectItem>
                                <SelectItem value="Boucles d'oreilles">Boucles d'oreilles</SelectItem>
                                <SelectItem value="Pendentif">Pendentif</SelectItem>
                                <SelectItem value="Montre">Montre</SelectItem>
                            </SelectContent>
                        </Select>
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
                            <Input id="price" type="number" placeholder="199.00" />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" placeholder="25" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sku">SKU (Unité de gestion de stock)</Label>
                            <Input id="sku" type="text" placeholder="PALA-001" />
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
