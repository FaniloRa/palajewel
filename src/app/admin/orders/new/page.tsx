import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import NewOrderClientPage from './page-client';
import type { OurProduct } from '@/types';
import { ourProductsData } from '@/data/ourProductsData';

export default async function NewOrderPage() {
    const connection = await connectDB();
    let products: OurProduct[] = [];

    if (connection) {
        products = JSON.parse(JSON.stringify(await Product.find({ status: 'active' }).sort({ name: 1 })));
    } else {
        products = ourProductsData.filter(p => p.status === 'active').sort((a,b) => a.name.localeCompare(b.name));
    }
    
    return <NewOrderClientPage products={products} />;
}
