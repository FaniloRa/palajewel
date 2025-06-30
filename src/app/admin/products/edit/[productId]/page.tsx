
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import type { OurProduct } from '@/types';
import EditProductPageClient from './page-client';


interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    await connectDB();
    // findById expects a valid MongoDB ObjectId, ensure the ID format is correct.
    if (!params.productId.match(/^[0-9a-fA-F]{24}$/) && !params.productId.startsWith('op')) {
        notFound();
    }
    const product: OurProduct | null = JSON.parse(JSON.stringify(await Product.findById(params.productId)));

    if (!product) {
        notFound();
    }
    
    return <EditProductPageClient product={product} />;
}
