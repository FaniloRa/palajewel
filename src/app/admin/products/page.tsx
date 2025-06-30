
import Image from 'next/image'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import connectDB from '@/lib/mongoose'
import Product from '@/models/Product'
import type { OurProduct } from '@/types'
import { ourProductsData } from '@/data/ourProductsData'

export default async function ProductsPage() {
  const connection = await connectDB();
  let products: OurProduct[] = [];

  if (connection) {
    products = JSON.parse(JSON.stringify(await Product.find({}).sort({ createdAt: -1 })));
  } else {
    products = [...ourProductsData].sort((a,b) => b.id.localeCompare(a.id));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Produits</CardTitle>
                <CardDescription>
                Gérez vos produits et consultez leurs performances de vente.
                {!connection && <span className="text-destructive block mt-1">Base de données non connectée. Les données affichées sont statiques.</span>}
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
            {products.map((product) => (
            <TableRow key={product.id}>
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
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                 <Badge variant={product.status === 'active' ? 'outline' : 'secondary'}>
                  {product.status === 'active' ? 'Actif' : 'Brouillon'}
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
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Affichage de <strong>1-{products.length}</strong> sur <strong>{products.length}</strong> produits
        </div>
      </CardFooter>
    </Card>
  )
}
