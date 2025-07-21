
import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface ISetting extends Document {
    id: string;
    key: string;
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const SettingSchema = new Schema<ISetting>({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
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

const Setting = models.Setting || model<ISetting>('Setting', SettingSchema);

export default Setting;
