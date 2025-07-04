
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const AddUserSchema = z.object({
    email: z.string().email({ message: "L'adresse e-mail est invalide." }),
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
    role: z.enum(['admin', 'caissier'], { errorMap: () => ({ message: "Le rôle est invalide." }) }),
});

export async function addUser(prevState: any, formData: FormData) {
    const validatedFields = AddUserSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await connectDB();
        const { email, password, role } = validatedFields.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: `Un utilisateur avec l'email "${email}" existe déjà.` };
        }

        await new User({ email, password, role }).save();
        revalidatePath('/admin/users');
        return { success: `L'utilisateur "${email}" a été ajouté avec succès.` };
    } catch (error: any) {
        return { error: 'Échec de la création de l\'utilisateur. ' + error.message };
    }
}

const UpdateUserSchema = z.object({
    role: z.enum(['admin', 'caissier'], { errorMap: () => ({ message: "Le rôle est invalide." }) }),
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }).optional().or(z.literal('')),
});

export async function updateUser(userId: string, prevState: any, formData: FormData) {
     const validatedFields = UpdateUserSchema.safeParse({
        role: formData.get('role'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }
    
    try {
        await connectDB();
        const { role, password } = validatedFields.data;

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return { error: 'Utilisateur non trouvé.' };
        }

        userToUpdate.role = role;
        if (password) {
            userToUpdate.password = password; // The pre-save hook will hash it
        }

        await userToUpdate.save();
        revalidatePath('/admin/users');
        return { success: 'L\'utilisateur a été mis à jour avec succès.' };
    } catch (error: any) {
        return { error: 'Échec de la mise à jour de l\'utilisateur. ' + error.message };
    }
}


export async function deleteUser(userId: string) {
    try {
        await connectDB();
        const user = await User.findById(userId);

        if (!user) {
            return { error: 'Utilisateur non trouvé.' };
        }

        if (user.email === 'admin@example.com') {
            return { error: 'Impossible de supprimer l\'utilisateur administrateur par défaut.' };
        }

        await User.findByIdAndDelete(userId);
        revalidatePath('/admin/users');
        return { success: 'L\'utilisateur a été supprimé avec succès.' };
    } catch (error: any) {
        return { error: 'Échec de la suppression de l\'utilisateur. ' + error.message };
    }
}
