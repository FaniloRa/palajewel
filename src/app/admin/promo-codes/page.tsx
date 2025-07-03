
import connectDB from '@/lib/mongoose';
import PromoCode from '@/models/PromoCode';
import type { IPromoCode } from '@/types';
import PromoCodesClientPage from './promo-codes-client-page';

export default async function PromoCodesPage() {
    await connectDB();
    const promoCodes: IPromoCode[] = JSON.parse(JSON.stringify(await PromoCode.find({}).sort({ createdAt: -1 })));

    return <PromoCodesClientPage promoCodes={promoCodes} />;
}
