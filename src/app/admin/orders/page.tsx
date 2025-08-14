
import { MoreHorizontal, PlusCircle, Eye } from "lucide-react"
import Link from "next/link"
import { format } from 'date-fns'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import connectDB from "@/lib/mongoose"
import Order, { type IOrder } from "@/models/Order"
import { Separator } from "@/components/ui/separator"


export default async function OrdersPage({ searchParams }: { searchParams?: { search?: string } }) {
    await connectDB();
    const searchTerm = searchParams?.search || '';

    const filter: any = {};
    if (searchTerm) {
        filter['customer.name'] = { $regex: searchTerm, $options: 'i' };
    }
    
    const orders: IOrder[] = JSON.parse(JSON.stringify(
        await Order.find(filter).sort({ createdAt: -1 })
    ));
    
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Fulfilled': return 'default';
            case 'Pending': return 'secondary';
            case 'Declined': return 'destructive';
            default: return 'outline';
        }
    }
     const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Fulfilled': return 'Livré';
            case 'Pending': return 'En attente';
            case 'Declined': return 'Refusé';
            default: return status;
        }
    }


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Commandes</CardTitle>
                    <CardDescription>
                        Gérez les commandes récentes de vos clients.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="h-8 gap-1">
                    <Link href="/admin/orders/new">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Nouvelle Commande
                        </span>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {/* Desktop Table View */}
                <Table className="hidden md:table">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                             <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {searchTerm ? `Aucune commande trouvée pour "${searchTerm}".` : "Aucune commande trouvée."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div className="font-medium">{order.customer.name}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {order.customer.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">Vente</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant={getStatusBadgeVariant(order.status)}>
                                        {getStatusLabel(order.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="text-right">{order.summary.total.toFixed(2)} €</TableCell>
                                <TableCell>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Voir
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                     {orders.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                             {searchTerm ? `Aucune commande trouvée pour "${searchTerm}".` : "Aucune commande trouvée."}
                        </div>
                     ) : (
                         orders.map(order => (
                            <Card key={order.id} className="w-full">
                               <CardHeader className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base">{order.customer.name}</CardTitle>
                                            <CardDescription>{order.customer.email}</CardDescription>
                                        </div>
                                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 text-sm">
                                   <div className="flex justify-between items-center text-muted-foreground">
                                        <span>Date: {format(new Date(order.createdAt), 'dd/MM/yy')}</span>
                                        <span className="font-bold text-lg text-foreground">{order.summary.total.toFixed(2)} €</span>
                                   </div>
                                </CardContent>
                                <Separator />
                                <CardFooter className="p-4">
                                    <Button asChild className="w-full">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            Voir les détails
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                         ))
                     )}
                </div>
            </CardContent>
        </Card>
    )
}
