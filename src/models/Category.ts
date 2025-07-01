
import mongoose, { Schema, models, model, Document } from 'mongoose';

// This represents the structure of the category document in MongoDB.
export interface ICategory extends Document {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
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

const Category = models.Category || model<ICategory>('Category', CategorySchema);

export default Category;
