import mongoose, { Schema, models, model, Document } from 'mongoose';

// Interface for a single item in the cart/order
interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
}

// Interface for the Order document
export interface IOrder extends Document {
    customer: {
        name: string;
        email: string;
    };
    items: OrderItem[];
    summary: {
        subtotal: number;
        tax: number;
        total: number;
    };
    paymentMethod: 'cash' | 'visa';
    status: 'Pending' | 'Fulfilled' | 'Declined';
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: { type: String, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    items: [OrderItemSchema],
    summary: {
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    paymentMethod: { type: String, enum: ['cash', 'visa'], required: true },
    status: { type: String, enum: ['Pending', 'Fulfilled', 'Declined'], default: 'Pending' },
}, {
    timestamps: true,
});

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
