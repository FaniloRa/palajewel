
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import connectDB from "@/lib/mongoose"
import Appointment from "@/models/Appointment"
import type { IAppointment } from "@/models/Appointment"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function AppointmentsPage() {
    await connectDB();
    const appointments: IAppointment[] = JSON.parse(JSON.stringify(
        await Appointment.find({}).sort({ scheduledAt: -1 })
    ));

    const getStatusVariant = (status: IAppointment['status']) => {
        switch (status) {
            case 'scheduled':
                return 'secondary';
            case 'completed':
                return 'default';
            case 'canceled':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    const getStatusText = (status: IAppointment['status']) => {
        switch (status) {
            case 'scheduled':
                return 'Programmé';
            case 'completed':
                return 'Terminé';
            case 'canceled':
                return 'Annulé';
            default:
                return status;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rendez-vous</CardTitle>
                <CardDescription>
                    Liste des rendez-vous pris pour des commandes sur mesure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Client</TableHead>
                            <TableHead>Type de rendez-vous</TableHead>
                            <TableHead>Date et heure</TableHead>
                            <TableHead>Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Aucun rendez-vous trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>
                                        <div className="font-medium">{appointment.name}</div>
                                        <div className="text-sm text-muted-foreground">{appointment.email}</div>
                                    </TableCell>
                                     <TableCell>
                                        {appointment.eventType}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(appointment.scheduledAt), 'PPP p', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(appointment.status)}>
                                            {getStatusText(appointment.status)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
