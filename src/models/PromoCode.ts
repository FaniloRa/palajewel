
import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IPromoCode extends Document {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expiresAt?: Date;
    isActive: boolean;
    minPurchase: number;
    usageLimit?: number;
    timesUsed: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    minPurchase: { type: Number, default: 0 },
    usageLimit: { type: Number },
    timesUsed: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

const PromoCode = models.PromoCode || model<IPromoCode>('PromoCode', PromoCodeSchema);

export default PromoCode;
