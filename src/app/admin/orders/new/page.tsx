import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import NewOrderClientPage from './page-client';
import type { OurProduct } from '@/types';

export default async function NewOrderPage() {
    await connectDB();
    const products: OurProduct[] = JSON.parse(JSON.stringify(await Product.find({ status: 'active' }).populate('category').sort({ name: 1 })));
    
    return <NewOrderClientPage products={products} />;
}
