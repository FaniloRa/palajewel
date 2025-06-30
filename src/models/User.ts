
import mongoose, { Schema, models, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password?: string;
    role: 'admin' | 'caissier';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Hide password by default
    role: { type: String, enum: ['admin', 'caissier'], required: true },
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model<IUser>('User', UserSchema);

export default User;
