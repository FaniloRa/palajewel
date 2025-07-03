
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import PromoCode from '@/models/PromoCode';

const PromoCodeSchema = z.object({
    code: z.string().min(3, { message: "Le code doit contenir au moins 3 caractères." }).max(50),
    discountType: z.enum(['percentage', 'fixed'], { errorMap: () => ({ message: "Le type de réduction est invalide."}) }),
    discountValue: z.coerce.number().positive({ message: "La valeur de la réduction doit être positive." }),
    expiresAt: z.preprocess((arg) => {
        if (typeof arg === 'string' && arg === '') return null; // Convert empty string to null
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
        return null;
    }, z.date().nullable()),
    isActive: z.boolean(),
    minPurchase: z.coerce.number().min(0).default(0),
    usageLimit: z.coerce.number().min(0).optional().nullable(),
});

export async function addPromoCode(prevState: any, formData: FormData) {
    const validatedFields = PromoCodeSchema.safeParse({
        code: formData.get('code'),
        discountType: formData.get('discountType'),
        discountValue: formData.get('discountValue'),
        expiresAt: formData.get('expiresAt'),
        isActive: formData.get('isActive') === 'on',
        minPurchase: formData.get('minPurchase'),
        usageLimit: formData.get('usageLimit') || null,
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await connectDB();
        const { code } = validatedFields.data;
        const existingCode = await PromoCode.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });
        if (existingCode) {
            return { error: `Le code promo "${code}" existe déjà.` };
        }

        await new PromoCode(validatedFields.data).save();
        revalidatePath('/admin/promo-codes');
        return { success: `Le code promo "${code}" a été ajouté.` };
    } catch (error: any) {
        return { error: 'Échec de la création du code promo. ' + error.message };
    }
}


export async function updatePromoCode(id: string, prevState: any, formData: FormData) {
    const validatedFields = PromoCodeSchema.safeParse({
        code: formData.get('code'),
        discountType: formData.get('discountType'),
        discountValue: formData.get('discountValue'),
        expiresAt: formData.get('expiresAt'),
        isActive: formData.get('isActive') === 'on',
        minPurchase: formData.get('minPurchase'),
        usageLimit: formData.get('usageLimit') || null,
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await connectDB();
        const { code } = validatedFields.data;
        const existingCode = await PromoCode.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') }, _id: { $ne: id } });
        if (existingCode) {
            return { error: `Un autre code promo nommé "${code}" existe déjà.` };
        }

        await PromoCode.findByIdAndUpdate(id, validatedFields.data);
        revalidatePath('/admin/promo-codes');
        return { success: `Le code promo "${code}" a été mis à jour.` };
    } catch (error: any) {
        return { error: 'Échec de la mise à jour du code promo. ' + error.message };
    }
}


export async function deletePromoCode(id: string) {
    try {
        await connectDB();
        await PromoCode.findByIdAndDelete(id);
        revalidatePath('/admin/promo-codes');
        return { success: 'Le code promo a été supprimé.' };
    } catch (error: any) {
        return { error: 'Échec de la suppression du code promo. ' + error.message };
    }
}


export async function applyPromoCode(code: string, subtotal: number) {
  if (!code) {
    return { error: 'Veuillez saisir un code promo.' };
  }
  
  try {
    await connectDB();
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
      return { error: 'Code promo invalide.' };
    }

    if (!promoCode.isActive) {
      return { error: 'Ce code promo n\'est plus actif.' };
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return { error: 'Ce code promo a expiré.' };
    }

    if (promoCode.usageLimit && promoCode.timesUsed >= promoCode.usageLimit) {
      return { error: 'Ce code promo a atteint sa limite d\'utilisation.' };
    }
    
    if (subtotal < promoCode.minPurchase) {
      return { error: `Le montant minimum d'achat pour ce code est de ${promoCode.minPurchase.toFixed(2)} €.` };
    }
    
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = subtotal * (promoCode.discountValue / 100);
    } else { // fixed
      discount = promoCode.discountValue;
    }
    
    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);

    return { 
      success: true, 
      discount: discount,
      message: `Réduction de ${promoCode.discountValue}${promoCode.discountType === 'percentage' ? '%' : '€'} appliquée.`
    };

  } catch (error: any) {
    return { error: 'Une erreur est survenue. ' + error.message };
  }
}
