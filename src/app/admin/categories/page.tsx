
import connectDB from '@/lib/mongoose';
import Category from '@/models/Category';
import type { ICategory } from '@/models/Category';
import CategoriesClientPage from './categories-client-page';

export default async function CategoriesPage() {
    await connectDB();
    const categories: ICategory[] = JSON.parse(JSON.stringify(await Category.find({}).sort({ name: 1 })));

    return <CategoriesClientPage categories={categories} />;
}
