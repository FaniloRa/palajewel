
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import type { OurProduct, ICategory } from '@/types';
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
    const product: OurProduct | null = JSON.parse(JSON.stringify(
        await Product.findById(params.productId).populate('category')
    ));
    const categories: ICategory[] = JSON.parse(JSON.stringify(await Category.find({}).sort({ name: 1 })));

    if (!product) {
        notFound();
    }
    
    return <EditProductPageClient product={product} categories={categories} />;
}
