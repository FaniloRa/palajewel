
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import type { IUser } from '@/types';
import UsersClientPage from './users-client-page';

export default async function UsersPage() {
    await connectDB();
    const users: IUser[] = JSON.parse(JSON.stringify(await User.find({}).sort({ createdAt: -1 })));

    return <UsersClientPage users={users} />;
}
