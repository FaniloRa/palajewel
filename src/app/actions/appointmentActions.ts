
'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongoose';
import Appointment from '@/models/Appointment';
import { z } from 'zod';

const AppointmentSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    eventUri: z.string().url(),
    eventType: z.string(),
    scheduledAt: z.string().datetime(),
});

export async function createAppointment(data: unknown) {
    const validatedFields = AppointmentSchema.safeParse(data);
    
    if (!validatedFields.success) {
        return { error: 'Invalid appointment data provided.' };
    }

    try {
        await connectDB();

        const { name, email, eventUri, eventType, scheduledAt } = validatedFields.data;

        const existingAppointment = await Appointment.findOne({ eventUri });
        if (existingAppointment) {
            // Calendly might send multiple webhooks. This prevents duplicates.
            return { success: true, message: 'Appointment already exists.' };
        }

        await new Appointment({
            name,
            email,
            eventUri,
            eventType,
            scheduledAt: new Date(scheduledAt),
        }).save();
        
        revalidatePath('/admin/appointments');

        return { success: true, message: 'Appointment saved successfully.' };

    } catch (error: any) {
        console.error("Failed to create appointment:", error);
        return { error: 'Failed to save appointment. ' + error.message };
    }
}
