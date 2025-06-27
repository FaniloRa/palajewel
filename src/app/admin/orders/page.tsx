
import { MoreHorizontal } from "lucide-react"

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

const orders = [
    { id: 'ORD001', customer: 'Liam Johnson', email: 'liam@example.com', date: '2023-06-23', amount: 250.00, status: 'Fulfilled' },
    { id: 'ORD002', customer: 'Olivia Smith', email: 'olivia@example.com', date: '2023-06-24', amount: 150.00, status: 'Declined' },
    { id: 'ORD003', customer: 'Noah Williams', email: 'noah@example.com', date: '2023-06-25', amount: 350.00, status: 'Fulfilled' },
    { id: 'ORD004', customer: 'Emma Brown', email: 'emma@example.com', date: '2023-06-26', amount: 450.00, status: 'Pending' },
]

export default function OrdersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Commandes</CardTitle>
                <CardDescription>Gérez les commandes récentes de vos clients.</CardDescription>
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
                        <TableRow key={order.id}>
                            <TableCell>
                                <div className="font-medium">{order.customer}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    {order.email}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">Vente</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant={order.status === 'Fulfilled' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'}>
                                    {order.status === 'Fulfilled' ? 'Livré' : order.status === 'Pending' ? 'En attente' : 'Refusé'}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                            <TableCell className="text-right">{order.amount.toFixed(2)} €</TableCell>
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
