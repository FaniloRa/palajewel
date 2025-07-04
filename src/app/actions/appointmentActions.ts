
'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongoose';
import Appointment from '@/models/Appointment';
import { z } from 'zod';
import { startOfDay, endOfDay } from 'date-fns';

const AppointmentFormSchema = z.object({
    name: z.string().min(2, "Le nom est requis."),
    email: z.string().email("L'adresse e-mail est invalide."),
    type: z.enum(['presentiel', 'visio'], { message: "Le type de rendez-vous est requis."}),
    date: z.string().min(1, "La date est requise."),
    time: z.string().min(1, "L'heure est requise."),
});

// This action is for the new form
export async function createAppointment(prevState: any, formData: FormData) {
    const validatedFields = AppointmentFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        type: formData.get('type'),
        date: formData.get('date'),
        time: formData.get('time'),
    });
    
    if (!validatedFields.success) {
        return { error: 'Données invalides. Veuillez vérifier les champs.', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await connectDB();

        const { name, email, type, date, time } = validatedFields.data;

        // Combine date and time string then convert to Date object
        // Example: date="2024-07-25", time="10:00" -> "2024-07-25T10:00:00"
        const scheduledAt = new Date(`${date}T${time}:00`);

        // Server-side check for availability
        const existingAppointment = await Appointment.findOne({ scheduledAt });
        if (existingAppointment) {
            return { error: 'Ce créneau est déjà réservé. Veuillez en choisir un autre.' };
        }

        await new Appointment({
            name,
            email,
            type,
            scheduledAt,
            status: 'scheduled',
        }).save();
        
        revalidatePath('/admin/appointments');

        return { success: true, message: 'Votre rendez-vous a été enregistré avec succès.' };

    } catch (error: any) {
        console.error("Failed to create appointment:", error);
        return { error: 'Échec de la sauvegarde du rendez-vous. ' + error.message };
    }
}

// This action fetches booked slots for a given day
export async function getBookedSlotsForDate(date: Date) {
    try {
        await connectDB();
        
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const appointments = await Appointment.find({
            scheduledAt: {
                $gte: dayStart,
                $lte: dayEnd,
            }
        });

        // Return time strings in HH:mm format
        const bookedTimes = appointments.map(app => {
            const d = new Date(app.scheduledAt);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        });
        
        return { success: true, bookedTimes };
    } catch (error) {
        console.error("Failed to fetch booked slots:", error);
        return { success: false, error: 'Impossible de récupérer les créneaux.' };
    }
}
