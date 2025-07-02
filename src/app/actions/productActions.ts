
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { z } from 'zod';

// Define a schema for validation with Zod
const ProductSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    description: z.string().optional(),
    detailedDescription: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    category: z.string().min(1, "La catégorie est requise"),
    imageUrl: z.string().url({ message: "L'URL de l'image de la carte est requise et doit être valide" }).min(1, "L'URL de l'image de la carte est requise"),
    mainImageUrl: z.string().url({ message: "L'URL de l'image principale est requise et doit être valide" }).min(1, "L'URL de l'image principale est requise"),
    thumbnailImageUrl1: z.string().url({ message: "L'URL de la vignette 1 est requise et doit être valide" }).min(1, "L'URL de la vignette 1 est requise"),
    thumbnailImageUrl2: z.string().url({ message: "L'URL de la vignette 2 est requise et doit être valide" }).min(1, "L'URL de la vignette 2 est requise"),
    stock: z.coerce.number().int().min(0, "Le stock ne peut pas être négatif"),
    sku: z.string().min(1, "Le SKU est requis"),
    featured: z.boolean().default(false),
});

// We remove 'status' from the form validation, as it's now automated.
const ProductFormSchema = ProductSchema;


export async function addProduct(prevState: any, formData: FormData) {
    try {
        await connectDB();
    } catch (dbError: any) {
        return {
            error: "La connexion à la base de données a échoué. Impossible d'ajouter le produit.",
        };
    }
    
    const isFeatured = formData.get('featured') === 'on';

    if (isFeatured) {
        const featuredCount = await Product.countDocuments({ featured: true });
        if (featuredCount >= 5) {
            return {
                error: "Limite de 5 produits en promotion atteinte. Veuillez d'abord en désactiver un autre.",
            };
        }
    }

    // Generate a unique ID for the new product
    const newId = `op${(await Product.countDocuments()) + 15}`;

    const validatedFields = ProductFormSchema.safeParse({
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
        sku: formData.get('sku'),
        featured: isFeatured,
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Automatically determine status based on stock
    const status = validatedFields.data.stock > 0 ? 'active' : 'draft';

    const productData = {
        _id: newId,
        ...validatedFields.data,
        status: status, // Set automated status
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

export async function updateProduct(productId: string, prevState: any, formData: FormData) {
    if (!productId) {
        return { error: "L'ID du produit est manquant pour la mise à jour." };
    }
    
    try {
        await connectDB();
    } catch (dbError: any) {
        return {
            error: "La connexion à la base de données a échoué. Impossible de mettre à jour le produit.",
        };
    }

    const isFeatured = formData.get('featured') === 'on';

    if (isFeatured) {
        const featuredCount = await Product.countDocuments({ featured: true, _id: { $ne: productId } });
        if (featuredCount >= 5) {
            return {
                error: "Limite de 5 produits en promotion atteinte. Veuillez d'abord en désactiver un autre.",
            };
        }
    }

    const validatedFields = ProductFormSchema.safeParse({
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
        sku: formData.get('sku'),
        featured: isFeatured,
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Automatically determine status based on stock
    const status = validatedFields.data.stock > 0 ? 'active' : 'draft';

    const productData = {
        ...validatedFields.data,
        status: status, // Set automated status
        imageAlt: `Image pour ${validatedFields.data.name}`,
        dataAiHint: 'jewelry fashion', // Generic hint
    };

    try {
        const productExists = await Product.findOne({ sku: productData.sku, _id: { $ne: productId } });
        if (productExists) {
            return { error: `Un autre produit avec le SKU ${productData.sku} existe déjà.` };
        }
        await Product.findByIdAndUpdate(productId, productData);
    } catch (error: any) {
        return { error: 'Échec de la mise à jour du produit. ' + error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath(`/produits/${productId}`);
    revalidatePath('/shop');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(productId: string) {
    if (!productId) {
        return { error: "L'ID du produit est manquant." };
    }

    try {
        await connectDB();
        await Product.findByIdAndDelete(productId);
        
        revalidatePath('/admin/products');
        revalidatePath('/shop');
        revalidatePath('/');

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete product:", error);
        return { error: 'Échec de la suppression du produit. ' + error.message };
    }
}
