
import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IAppointment extends Document {
    id: string;
    name: string;
    email: string;
    eventUri: string;
    eventType: string;
    scheduledAt: Date;
    status: 'scheduled' | 'completed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventUri: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
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

const Appointment = models.Appointment || model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
