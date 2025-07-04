
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import DashboardClient from './dashboard-client';
import { startOfMonth, subMonths, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { IOrder } from '@/models/Order';

interface MonthlySales {
    _id: { year: number; month: number };
    totalSales: number;
}

interface CategorySales {
    _id: string; // Category Name
    totalQuantity: number;
}

// Function to get the last 6 months labels
const getLast6Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthName = format(d, 'MMM', { locale: fr });
        months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    }
    return months;
};

export default async function Dashboard() {
    await connectDB();

    const today = new Date();
    const sixMonthsAgo = subMonths(today, 6);
    const thisMonthStart = startOfMonth(today);

    // Fetch all orders in one go for efficiency
    const allOrders: IOrder[] = await Order.find({}).lean();
    const recentOrders: IOrder[] = allOrders.filter(order => new Date(order.createdAt) >= sixMonthsAgo);

    // --- Card Stats ---
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.summary.total, 0);
    const totalSales = allOrders.length;
    
    const customers = new Set(allOrders.map(order => order.customer.email));
    const totalCustomers = customers.size;
    
    const salesThisMonth = allOrders.filter(order => new Date(order.createdAt) >= thisMonthStart).length;
    
    // --- Sales Performance Chart ---
    const salesData = getLast6Months().map(monthName => ({ name: monthName, Ventes: 0 }));

    recentOrders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        // Ensure we are comparing dates in a consistent timezone (local server timezone)
        const monthName = format(orderDate, 'MMM', { locale: fr });
        const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const index = salesData.findIndex(d => d.name === capitalizedMonthName);
        if (index !== -1) {
            salesData[index].Ventes += order.summary.total;
        }
    });

    // --- Popular Categories Chart (using aggregation for efficiency) ---
    const categorySales: CategorySales[] = await Order.aggregate([
        { $unwind: '$items' },
        {
            $lookup: {
                from: 'products',
                localField: 'items.productId',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        { $unwind: '$productInfo' },
        {
            $lookup: {
                from: 'categories',
                localField: 'productInfo.category',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        { $unwind: '$categoryInfo' },
        {
            $group: {
                _id: '$categoryInfo.name', // Group by category name
                totalQuantity: { $sum: '$items.quantity' }
            }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 4 }
    ]);

    const categoryData = categorySales.map(cat => ({
        name: cat._id,
        value: cat.totalQuantity
    }));
    
    return (
        <DashboardClient
            totalRevenue={totalRevenue}
            totalCustomers={totalCustomers}
            totalSales={totalSales}
            salesThisMonth={salesThisMonth}
            salesData={salesData}
            categoryData={categoryData}
        />
    );
}
