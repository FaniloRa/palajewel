
import mongoose, { Schema, models, model, Document } from 'mongoose';
import type { OurProduct } from '@/types';

// Extend OurProduct to include mongoose Document properties like _id
interface IProduct extends OurProduct, Document {}

const ProductSchema = new Schema<IProduct>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, required: true },
    dataAiHint: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    detailedDescription: { type: String },
    mainImageUrl: { type: String, required: true },
    thumbnailImageUrl1: { type: String, required: true },
    thumbnailImageUrl2: { type: String, required: true },
    stock: { type: Number, required: true },
    status: { type: String, enum: ['active', 'draft'], required: true },
    featured: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            if (ret.category && typeof ret.category === 'object' && ret.category._id) {
                ret.category.id = ret.category._id.toString();
                delete ret.category._id;
            }
            delete ret._id;
            delete ret.__v;
        }
    }
});

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
