
'use client';

import Image from 'next/image';
import { Gift, Truck, Tag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import type { OurProduct } from '@/types';

interface ProductDetailPageClientProps {
    product: OurProduct;
}

export default function ProductDetailPageClient({ product }: ProductDetailPageClientProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `"${product.name}" a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Image Gallery Column */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-xl border border-border group cursor-zoom-in">
          <Image 
            src={product.mainImageUrl} 
            alt={product.name} 
            fill
            style={{objectFit: "cover"}}
            data-ai-hint={`${product.dataAiHint} main`}
            priority
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md border border-border group cursor-zoom-in">
            <Image 
              src={product.thumbnailImageUrl1} 
              alt={`${product.name} vignette 1`} 
              fill
              style={{objectFit: "cover"}}
              data-ai-hint={`${product.dataAiHint} thumbnail one`}
              className="transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md border border-border group cursor-zoom-in">
            <Image 
              src={product.thumbnailImageUrl2} 
              alt={`${product.name} vignette 2`} 
              fill
              style={{objectFit: "cover"}}
              data-ai-hint={`${product.dataAiHint} thumbnail two`}
              className="transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* Product Info Column */}
      <div className="py-4">
        <h1 className="text-3xl lg:text-4xl font-headline text-primary mb-2">{product.name}</h1>
        <p className="text-sm text-muted-foreground mb-1">RÉF. {product.sku}</p>
        <p className="text-3xl lg:text-4xl font-bold text-accent-foreground mb-6">{product.price.toFixed(2)} €</p>
        
        <div className="prose prose-sm lg:prose-base text-accent-foreground/80 mb-8 font-body">
          <p>{product.detailedDescription || product.description}</p>
        </div>
        
        <Button 
          size="lg" 
          className="w-full mb-8 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
          disabled={product.stock <= 0}
          onClick={handleAddToCart}
        >
          {product.stock > 0 ? 'AJOUTER DANS LE PANIER' : 'EN RUPTURE DE STOCK'}
        </Button>
        
        <div className="space-y-3 font-body">
          <div className="flex items-center text-sm text-accent-foreground/90">
            <Gift size={20} className="mr-3 text-primary shrink-0" />
            <span>C'est un cadeau</span>
          </div>
          <div className="flex items-center text-sm text-accent-foreground/90">
            <Truck size={20} className="mr-3 text-primary shrink-0" />
            <span>Livraison et retours gratuits</span>
          </div>
          <div className="flex items-center text-sm text-accent-foreground/90">
            <Tag size={20} className="mr-3 text-primary shrink-0" />
            <span>Les codes de promotions peuvent être saisis à l'étape suivante</span>
          </div>
          <div className="flex items-center text-sm text-accent-foreground/90">
            <ShieldCheck size={20} className="mr-3 text-primary shrink-0" />
            <span>Paiements sécurisés</span>
          </div>
        </div>
      </div>
    </div>
  );
}
