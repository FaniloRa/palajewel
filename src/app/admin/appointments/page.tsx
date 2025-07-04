
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import connectDB from "@/lib/mongoose"
import Appointment from "@/models/Appointment"
import type { IAppointment } from "@/models/Appointment"
import AppointmentsCalendarView from "./appointments-calendar-view"

export default async function AppointmentsPage() {
    await connectDB();
    const appointments: IAppointment[] = JSON.parse(JSON.stringify(
        await Appointment.find({}).sort({ scheduledAt: -1 })
    ));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calendrier des Rendez-vous</CardTitle>
                <CardDescription>
                    Visualisez et gérez les rendez-vous pris pour des commandes sur mesure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AppointmentsCalendarView appointments={appointments} />
            </CardContent>
        </Card>
    );
}
