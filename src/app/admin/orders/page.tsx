
import { MoreHorizontal, PlusCircle } from "lucide-react"
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
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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


export default async function OrdersPage() {
    await connectDB();
    const orders: IOrder[] = JSON.parse(JSON.stringify(await Order.find({}).sort({ createdAt: -1 })));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Commandes</CardTitle>
                    <CardDescription>Gérez les commandes récentes de vos clients.</CardDescription>
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
                <Table>
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
                        {orders.map(order => (
                        <TableRow key={order._id}>
                            <TableCell>
                                <div className="font-medium">{order.customer.name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    {order.customer.email}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">Vente</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant={order.status === 'Fulfilled' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'}>
                                    {order.status === 'Fulfilled' ? 'Livré' : order.status === 'Pending' ? 'En attente' : 'Refusé'}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</TableCell>
                            <TableCell className="text-right">{order.summary.total.toFixed(2)} €</TableCell>
                             <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Voir la commande</DropdownMenuItem>
                                    <DropdownMenuItem>Voir le client</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
