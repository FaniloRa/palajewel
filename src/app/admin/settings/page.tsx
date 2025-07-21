
import connectDB from '@/lib/mongoose';
import { getSetting } from '@/app/actions/settingActions';
import SettingsClientPage from './settings-client-page';

export default async function SettingsPage() {
    await connectDB();
    const exchangeRate = await getSetting('exchangeRateEuroToMGA');

    return (
        <SettingsClientPage currentRate={exchangeRate} />
    );
}
