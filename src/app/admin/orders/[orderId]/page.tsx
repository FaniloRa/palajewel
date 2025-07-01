
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import type { IOrder } from '@/models/Order';
import OrderDetailPageClient from './page-client';
import mongoose from 'mongoose';


interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.orderId)) {
        notFound();
    }
    
    const order: IOrder | null = JSON.parse(JSON.stringify(await Order.findById(params.orderId)));

    if (!order) {
        notFound();
    }
    
    return <OrderDetailPageClient order={order} />;
}
