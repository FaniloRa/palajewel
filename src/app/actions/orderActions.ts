
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
        const connection = await connectDB();
        if (!connection) {
            return { error: "La base de données n'est pas connectée. Impossible de créer la commande." };
        }

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
        
        const finalizedOrderForReceipt = {
            ...newOrder.toObject(),
            // Ensure all necessary fields are serializable
            _id: newOrder._id.toString(),
            date: newOrder.createdAt.toISOString(),
            items: newOrder.items.map(item => ({
                ...item,
                product: {
                    id: item.productId,
                    name: item.name,
                    price: item.price,
                }
            }))
        };
        
        return { success: true, order: JSON.parse(JSON.stringify(finalizedOrderForReceipt)) };

    } catch (error: any) {
        console.error("Failed to create order:", error);
        return { error: 'Échec de la création de la commande. ' + error.message };
    }
}
