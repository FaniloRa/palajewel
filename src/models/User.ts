
import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string; // Password is required but might be omitted in client-side objects
    role: 'admin' | 'caissier';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'caissier'], required: true },
}, {
    timestamps: true
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
