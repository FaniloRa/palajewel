
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import connectDB from "@/lib/mongoose"
import Appointment from "@/models/Appointment"
import type { IAppointment } from "@/types" // Use the client-side type definition
import AppointmentsCalendarView from "./appointments-calendar-view"

export default async function AppointmentsPage() {
    await connectDB();
    
    // Use .lean() to get plain JavaScript objects directly from the database.
    // This is more efficient and safer than serializing Mongoose documents.
    const dbAppointments = await Appointment.find({}).sort({ scheduledAt: -1 }).lean();

    // Manually map the data to match the client-side IAppointment interface from /src/types
    // This ensures dates are in a consistent format (ISO string) that the client can parse.
    const appointments: IAppointment[] = dbAppointments.map(app => ({
      id: app._id.toString(),
      name: app.name,
      email: app.email,
      type: app.type,
      scheduledAt: app.scheduledAt.toISOString(),
      status: app.status,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));

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
