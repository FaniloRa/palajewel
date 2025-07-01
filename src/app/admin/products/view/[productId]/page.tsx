
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import type { OurProduct } from '@/types';
import ViewProductPageClient from './page-client';


interface ViewProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ViewProductPage({ params }: ViewProductPageProps) {
    await connectDB();
    if (!params.productId.match(/^[0-9a-fA-F]{24}$/) && !params.productId.startsWith('op')) {
        notFound();
    }
    const product: OurProduct | null = JSON.parse(JSON.stringify(
        await Product.findById(params.productId).populate('category')
    ));

    if (!product) {
        notFound();
    }
    
    return <ViewProductPageClient product={product} />;
}
