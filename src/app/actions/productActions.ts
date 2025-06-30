
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { z } from 'zod';

// Define a schema for validation with Zod
const ProductSchema = z.object({
    _id: z.string().min(1, "L'ID est requis"),
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    description: z.string().optional(),
    detailedDescription: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    category: z.string().min(1, "La catégorie est requise"),
    imageUrl: z.string().url("L'URL de l'image de la carte est invalide"),
    mainImageUrl: z.string().url("L'URL de l'image principale est invalide"),
    thumbnailImageUrl1: z.string().url("L'URL de la vignette 1 est invalide"),
    thumbnailImageUrl2: z.string().url("L'URL de la vignette 2 est invalide"),
    stock: z.coerce.number().int().min(0, "Le stock ne peut pas être négatif"),
    status: z.enum(['active', 'draft']),
    sku: z.string().min(1, "Le SKU est requis"),
});


export async function addProduct(prevState: any, formData: FormData) {
    await connectDB();
    
    // Generate a unique ID for the new product
    const newId = `op${(await Product.countDocuments()) + 15}`;

    const validatedFields = ProductSchema.safeParse({
        _id: newId,
        name: formData.get('name'),
        description: formData.get('description'),
        detailedDescription: formData.get('detailed-description'),
        price: formData.get('price'),
        category: formData.get('category'),
        imageUrl: formData.get('image-url'),
        mainImageUrl: formData.get('main-image-url'),
        thumbnailImageUrl1: formData.get('thumbnail1-url'),
        thumbnailImageUrl2: formData.get('thumbnail2-url'),
        stock: formData.get('stock'),
        status: formData.get('status'),
        sku: formData.get('sku'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const productData = {
        ...validatedFields.data,
        imageAlt: `Image pour ${validatedFields.data.name}`,
        dataAiHint: 'jewelry fashion', // Generic hint
    };

    try {
        const productExists = await Product.findOne({ sku: productData.sku });
        if (productExists) {
            return { error: `Un produit avec le SKU ${productData.sku} existe déjà.` };
        }
        const newProduct = new Product(productData);
        await newProduct.save();
    } catch (error: any) {
        return { error: 'Échec de la création du produit. ' + error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');
    redirect('/admin/products');
}
