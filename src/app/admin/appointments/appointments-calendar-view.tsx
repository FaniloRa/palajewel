
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import type { EventInput } from '@fullcalendar/core';

import type { IAppointment } from "@/models/Appointment";
import './calendar.css';

interface AppointmentsCalendarViewProps {
    appointments: IAppointment[];
}

export default function AppointmentsCalendarView({ appointments }: AppointmentsCalendarViewProps) {
    const events: EventInput[] = appointments.map(app => ({
        id: app.id,
        title: `${app.name} - ${app.eventType}`,
        start: new Date(app.scheduledAt),
        allDay: false,
        extendedProps: {
            email: app.email,
            status: app.status
        },
        backgroundColor: app.status === 'completed' ? '#22c55e' : (app.status === 'canceled' ? '#ef4444' : '#3b82f6'),
        borderColor: app.status === 'completed' ? '#16a34a' : (app.status === 'canceled' ? '#dc2626' : '#2563eb'),
    }));

    return (
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
                editable={false} // Prevent dragging and resizing
                selectable={false}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                }}
                // You can add an eventClick handler here to show a dialog with more details
                // eventClick={(info) => {
                //   alert('Event: ' + info.event.title);
                // }}
            />
        </div>
    );
}
