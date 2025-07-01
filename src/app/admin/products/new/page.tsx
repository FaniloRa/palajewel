
import NewProductPageClient from './page-client';
import connectDB from '@/lib/mongoose';
import Category from '@/models/Category';
import type { ICategory } from '@/types';

export default async function NewProductPage() {
    await connectDB();
    const categories: ICategory[] = JSON.parse(JSON.stringify(await Category.find({}).sort({ name: 1 })));
    return <NewProductPageClient categories={categories} />;
}
