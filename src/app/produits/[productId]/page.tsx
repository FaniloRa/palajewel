
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import type { OurProduct } from '@/types';
import ProductDetailPageClient from './page-client';


interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateStaticParams() {
  await connectDB();
  const products = await Product.find({ status: 'active' }).select('_id').lean();
  
  return products.map((product) => ({
    productId: product._id.toString(),
  }));
}

const ProductDetailPage = async ({ params }: ProductPageProps) => {
  await connectDB();
  const product: OurProduct | null = JSON.parse(JSON.stringify(await Product.findById(params.productId).populate('category')));


  if (!product) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-accent text-accent-foreground">
      <div className="w-full">
        <Header themeVariant="onLightBg" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
        <ProductDetailPageClient product={product} />
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetailPage;
