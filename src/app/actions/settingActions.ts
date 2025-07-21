
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Setting from '@/models/Setting';

const SettingSchema = z.object({
    key: z.string(),
    value: z.string().min(1, { message: "La valeur ne peut pas être vide." }),
});

export async function getSetting(key: string) {
    try {
        await connectDB();
        const setting = await Setting.findOne({ key });
        return setting ? setting.value : null;
    } catch (error) {
        console.error(`Failed to get setting ${key}:`, error);
        return null;
    }
}

export async function updateSetting(prevState: any, formData: FormData) {
    const validatedFields = SettingSchema.safeParse({
        key: formData.get('key'),
        value: formData.get('value'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors.value?.join(', ') };
    }

    const { key, value } = validatedFields.data;

    if (key === 'exchangeRateEuroToMGA') {
        const rate = parseFloat(value);
        if (isNaN(rate) || rate <= 0) {
            return { error: 'Le taux de change doit être un nombre positif.' };
        }
    }

    try {
        await connectDB();
        
        await Setting.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        revalidatePath('/admin/settings');

        return { success: `Le paramètre a été mis à jour avec succès.` };
    } catch (error: any) {
        return { error: 'Échec de la mise à jour du paramètre. ' + error.message };
    }
}
