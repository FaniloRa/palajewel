
'use server';

import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import type { OurProduct } from '@/types';

interface CartItem {
    product: OurProduct;
    quantity: number;
}

interface CreateOrderInput {
    customer: { name: string; email: string };
    cart: CartItem[];
    summary: { subtotal: number; tax: number; total: number };
    paymentMethod: 'cash' | 'visa';
}

export async function createOrder(data: CreateOrderInput) {
    try {
        await connectDB();

        const { customer, cart, summary, paymentMethod } = data;

        // Check stock and prepare order items
        const orderItems = [];
        for (const item of cart) {
            const product = await Product.findById(item.product.id);
            if (!product) {
                return { error: `Produit ${item.product.name} non trouvé.` };
            }
            if (product.stock < item.quantity) {
                return { error: `Stock insuffisant pour ${item.product.name}. Il ne reste que ${product.stock}.` };
            }
            
            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                imageUrl: product.imageUrl,
            });
        }
        
        // Create the new order
        const newOrder = new Order({
            customer,
            items: orderItems,
            summary,
            paymentMethod,
            status: 'Fulfilled', // Assume fulfilled for in-person sales
        });
        await newOrder.save();
        
        // Decrease stock for each product
        for (const item of cart) {
            await Product.findByIdAndUpdate(item.product.id, {
                $inc: { stock: -item.quantity },
            });
        }
        
        revalidatePath('/admin/orders');
        revalidatePath('/admin/products'); // to reflect stock changes
        
        // The saved order object is already in a good shape.
        // We just need to serialize it correctly for the client.
        return { success: true, order: JSON.parse(JSON.stringify(newOrder)) };

    } catch (error: any) {
        console.error("Failed to create order:", error);
        return { error: 'Échec de la création de la commande. ' + error.message };
    }
}
