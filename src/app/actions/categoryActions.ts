
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Category from '@/models/Category';
import Product from '@/models/Product';

const CategorySchema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
});

export async function addCategory(prevState: any, formData: FormData) {
    const validatedFields = CategorySchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors.name?.join(', ') };
    }

    const { name } = validatedFields.data;

    try {
        await connectDB();
        
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return { error: `La catégorie "${name}" existe déjà.` };
        }

        await new Category({ name }).save();
        
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products/new');
        revalidatePath('/admin/products/edit', 'layout');

        return { success: `La catégorie "${name}" a été ajoutée avec succès.` };
    } catch (error: any) {
        return { error: 'Échec de la création de la catégorie. ' + error.message };
    }
}

export async function updateCategory(categoryId: string, name: string) {
    const validatedFields = CategorySchema.safeParse({ name });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors.name?.join(', ') };
    }

    try {
        await connectDB();
        
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: categoryId } });
        if (existingCategory) {
            return { error: `Une autre catégorie nommée "${name}" existe déjà.` };
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
        if (!updatedCategory) {
            return { error: 'Catégorie non trouvée.' };
        }
        
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products/new');
        revalidatePath('/admin/products/edit', 'layout');
        
        return { success: `La catégorie a été mise à jour en "${name}".` };
    } catch (error: any) {
        return { error: 'Échec de la mise à jour de la catégorie. ' + error.message };
    }
}

export async function deleteCategory(categoryId: string) {
    try {
        await connectDB();
        
        const productCount = await Product.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return { error: `Impossible de supprimer cette catégorie car ${productCount} produit(s) y sont associés.` };
        }

        await Category.findByIdAndDelete(categoryId);
        
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products/new');
        revalidatePath('/admin/products/edit', 'layout');

        return { success: 'La catégorie a été supprimée avec succès.' };
    } catch (error: any) {
        return { error: 'Échec de la suppression de la catégorie. ' + error.message };
    }
}
