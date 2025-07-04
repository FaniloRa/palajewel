
'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import type { EventInput, EventClickArg } from '@fullcalendar/core';
import { User, Mail, Video, Building, Clock, Info } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { IAppointment } from "@/types";
import './calendar.css';

interface AppointmentsCalendarViewProps {
    appointments: IAppointment[];
}

export default function AppointmentsCalendarView({ appointments }: AppointmentsCalendarViewProps) {
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const events: EventInput[] = appointments.map(app => ({
        id: app.id,
        title: `${app.name} - ${app.type === 'visio' ? 'Visio' : 'Présentiel'}`,
        start: new Date(app.scheduledAt),
        allDay: false,
        extendedProps: app, // Pass the whole appointment object
        backgroundColor: app.status === 'completed' ? '#22c55e' : (app.status === 'canceled' ? '#ef4444' : '#3b82f6'),
        borderColor: app.status === 'completed' ? '#16a34a' : (app.status === 'canceled' ? '#dc2626' : '#2563eb'),
    }));
    
    const handleEventClick = (clickInfo: EventClickArg) => {
        const appointmentDetails = clickInfo.event.extendedProps as IAppointment;
        setSelectedAppointment(appointmentDetails);
        setIsDialogOpen(true);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'scheduled': return 'secondary';
            case 'canceled': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <>
            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    events={events}
                    locale={frLocale}
                    height="auto"
                    editable={false}
                    selectable={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="16:00:00"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false,
                        hour12: false
                    }}
                    eventClick={handleEventClick}
                />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Détails du Rendez-vous</DialogTitle>
                        <DialogDescription>
                            Informations concernant le rendez-vous planifié.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className="py-4 grid gap-4">
                           <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{selectedAppointment.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <a href={`mailto:${selectedAppointment.email}`} className="text-primary hover:underline">{selectedAppointment.email}</a>
                           </div>
                            <div className="flex items-center gap-3">
                                {selectedAppointment.type === 'visio' 
                                    ? <Video className="h-5 w-5 text-muted-foreground" /> 
                                    : <Building className="h-5 w-5 text-muted-foreground" />}
                                <span>Rendez-vous {selectedAppointment.type === 'visio' ? 'en visioconférence' : 'en boutique'}</span>
                            </div>
                           <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <span>
                                    {new Date(selectedAppointment.scheduledAt).toLocaleString('fr-FR', { 
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                    })}
                                </span>
                           </div>
                             <div className="flex items-center gap-3">
                                <Info className="h-5 w-5 text-muted-foreground" />
                                 <Badge variant={getStatusBadgeVariant(selectedAppointment.status)} className="capitalize">{selectedAppointment.status}</Badge>
                           </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
