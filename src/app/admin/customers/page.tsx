

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import connectDB from "@/lib/mongoose"
import Order from "@/models/Order"
import { format } from 'date-fns'

interface CustomerProfile {
  _id: string; // This will be the email
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
}

// Function to get initials from a name
const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.toUpperCase();
};


export default async function CustomersPage({ searchParams }: { searchParams?: { search?: string } }) {
    await connectDB();
    const searchTerm = searchParams?.search || '';

    const pipeline: any[] = [
        {
          $group: {
            _id: "$customer.email",
            name: { $first: "$customer.name" },
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$summary.total" },
            lastOrderDate: { $max: "$createdAt" },
          },
        },
        {
          $sort: { lastOrderDate: -1 }, // Sort by most recent customers
        },
    ];

    if (searchTerm) {
        pipeline.unshift({ // Prepend the match stage to filter documents before grouping
             $match: {
                $or: [
                    { 'customer.name': { $regex: searchTerm, $options: 'i' } },
                    { 'customer.email': { $regex: searchTerm, $options: 'i' } },
                ],
            },
        });
    }

    const customerData: CustomerProfile[] = JSON.parse(JSON.stringify(await Order.aggregate(pipeline)));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>
                    Liste de tous les clients ayant passé une commande.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Desktop View */}
                <Table className="hidden md:table">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[280px]">Client</TableHead>
                            <TableHead className="hidden sm:table-cell">Dernière commande</TableHead>
                            <TableHead className="text-center hidden sm:table-cell">Commandes</TableHead>
                            <TableHead className="text-right">Total dépensé</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {customerData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    {searchTerm ? `Aucun client trouvé pour "${searchTerm}".` : "Aucun client trouvé."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            customerData.map((customer) => (
                                <TableRow key={customer._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{customer.name}</div>
                                                <div className="text-sm text-muted-foreground">{customer._id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {format(new Date(customer.lastOrderDate), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell className="text-center hidden sm:table-cell">
                                        <Badge variant="outline">{customer.totalOrders}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {customer.totalSpent.toFixed(2)} €
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                
                 {/* Mobile View */}
                 <div className="md:hidden space-y-4">
                    {customerData.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            {searchTerm ? `Aucun client trouvé pour "${searchTerm}".` : "Aucun client."}
                        </div>
                    ) : (
                        customerData.map((customer) => (
                            <Card key={customer._id}>
                                <CardHeader className="p-4 flex items-start gap-4">
                                     <Avatar className="h-10 w-10">
                                        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{customer._id}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                    <p>Dernière commande : {format(new Date(customer.lastOrderDate), 'dd/MM/yyyy')}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
                                    <Badge variant="outline">{customer.totalOrders} commande(s)</Badge>
                                    <span className="font-semibold text-base text-foreground">{customer.totalSpent.toFixed(2)} €</span>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                 </div>

            </CardContent>
        </Card>
    );
}
