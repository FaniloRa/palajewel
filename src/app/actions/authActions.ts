
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const LoginSchema = z.object({
    email: z.string().email({ message: "L'adresse e-mail est invalide." }),
    password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export async function loginUser(prevState: any, formData: FormData) {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            error: "Veuillez vérifier les champs saisis.",
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
            return { error: "Aucun utilisateur trouvé avec cette adresse e-mail." };
        }

        // In a real application, passwords should be hashed and compared securely.
        // For this prototype, we'll do a plain text comparison.
        if (user.password !== password) {
            return { error: "Mot de passe incorrect." };
        }

        // Redirect to admin dashboard with role as a query parameter
        redirect(`/admin?role=${user.role}`);

    } catch (error: any) {
        return { error: "Une erreur est survenue lors de la connexion. " + error.message };
    }
}
