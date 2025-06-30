
import connectDB from '@/lib/mongoose'
import Product from '@/models/Product'
import type { OurProduct } from '@/types'
import ProductsPageClient from './products-client-page'


export default async function ProductsPage() {
  await connectDB();
  const products: OurProduct[] = JSON.parse(JSON.stringify(await Product.find({}).sort({ createdAt: -1 })));

  return <ProductsPageClient products={products} />;
}
