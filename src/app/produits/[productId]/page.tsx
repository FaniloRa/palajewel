
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Gift, Truck, Tag, ShieldCheck } from 'lucide-react';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import type { OurProduct } from '@/types';
import { ourProductsData } from '@/data/ourProductsData';


interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateStaticParams() {
  const connection = await connectDB();
  if (!connection) {
    return ourProductsData.map((product) => ({ productId: product.id }));
  }
  const products = await Product.find({ status: 'active' }).select('_id').lean();
  
  return products.map((product) => ({
    productId: product._id,
  }));
}

const ProductDetailPage = async ({ params }: ProductPageProps) => {
  const connection = await connectDB();
  let product: OurProduct | null | undefined = null;

  if (connection) {
    product = JSON.parse(JSON.stringify(await Product.findById(params.productId)));
  } else {
    product = ourProductsData.find(p => p.id === params.productId);
  }


  if (!product) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-accent text-accent-foreground">
      <div className="w-full">
        <Header themeVariant="onLightBg" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
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
            
            <Button size="lg" className="w-full mb-8 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base">
              AJOUTER DANS LE PANIER
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
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetailPage;
