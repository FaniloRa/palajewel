
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import User, { type IUser } from '@/models/User';

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
    
    let user: IUser | null;

    try {
        await connectDB();
        // Explicitly select password as it might be excluded by default
        user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) {
            return { error: "Aucun utilisateur trouvé avec cette adresse e-mail." };
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return { error: "Mot de passe incorrect." };
        }

    } catch (error: any) {
        console.error("Login Error:", error);
        return { error: "Une erreur est survenue lors de la connexion. " + error.message };
    }
    
    // Redirect to the transition page which will then redirect to the dashboard
    redirect(`/admin/loading-transition?role=${user.role}`);
}
