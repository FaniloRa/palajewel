
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { format, addDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { createAppointment, getBookedSlotsForDate } from '@/app/actions/appointmentActions';
import { Loader2, CheckCircle } from 'lucide-react';
import NewsletterSection from '@/components/NewsletterSection';

const initialState = {
  success: false,
  error: null,
  errors: null,
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmation...
                </>
            ) : (
                'Confirmer le rendez-vous'
            )}
        </Button>
    )
}

// Define working hours and slot duration
const workingHours = { start: 9, end: 16 }; // 9 AM to 4 PM (16:00)

function generateTimeSlots() {
    const slots = [];
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(time);
    }
    return slots;
}

export default function RendezVousPage() {
    const { toast } = useToast();
    const [state, formAction] = useFormState(createAppointment, initialState);

    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isFetchingSlots, startFetchingTransition] = useTransition();

    const availableTimeSlots = generateTimeSlots().filter(slot => !bookedSlots.includes(slot));
    
    useEffect(() => {
        if (state.error) {
            toast({
                title: 'Erreur',
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast]);
    
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        
        // Prevent selecting past dates
        if (selectedDate < startOfDay(new Date())) {
            return;
        }

        setDate(selectedDate);
        setTime(''); // Reset time when date changes
        
        startFetchingTransition(async () => {
            const result = await getBookedSlotsForDate(selectedDate);
            if (result.success && result.bookedTimes) {
                setBookedSlots(result.bookedTimes);
            } else {
                toast({ title: 'Erreur', description: "Impossible de charger les créneaux disponibles.", variant: 'destructive'});
            }
        });
    }
    
    if (state.success) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
                <Header themeVariant="onLightBg" />
                <main className="flex-grow container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center">
                    <Card className="w-full max-w-lg text-center p-8">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                        <CardTitle className="text-2xl mb-2">Rendez-vous confirmé !</CardTitle>
                        <CardDescription>
                           {state.message} Un e-mail de confirmation vous sera envoyé.
                        </CardDescription>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F5]">
            <Header themeVariant="onLightBg" />
            <main className="flex-grow container mx-auto px-4 py-24 md:py-32 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                        Prendre un Rendez-vous
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                      Planifiez un moment privilégié avec nos artisans pour créer votre bijou sur mesure.
                    </p>
                </div>
                
                <Card className="w-full max-w-2xl shadow-lg border">
                    <CardContent className="p-6 md:p-8">
                        <form action={formAction} className="space-y-8">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom et prénom</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Adresse e-mail</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                            </div>
                            
                            {/* Appointment Type */}
                            <div className="space-y-2">
                                <Label>Type de rendez-vous</Label>
                                <RadioGroup name="type" required defaultValue="presentiel" className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="presentiel" id="presentiel" />
                                        <Label htmlFor="presentiel">En boutique (Présentiel)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="visio" id="visio" />
                                        <Label htmlFor="visio">Visioconférence</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Date & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        className="rounded-md border p-0"
                                        locale={fr}
                                        disabled={(day) => day < addDays(new Date(), -1) || day.getDay() === 0 || day.getDay() === 6} // Disable past dates, Sundays, Saturdays
                                    />
                                    <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Heure (Heure de Madagascar)</Label>
                                    <Select name="time" required value={time} onValueChange={setTime} disabled={!date || isFetchingSlots}>
                                        <SelectTrigger id="time">
                                            <SelectValue placeholder={!date ? "Choisissez d'abord une date" : "Choisissez un créneau"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isFetchingSlots ? (
                                                <div className="flex items-center justify-center p-4">
                                                    <Loader2 className="h-5 w-5 animate-spin"/>
                                                </div>
                                            ) : availableTimeSlots.length > 0 ? (
                                                availableTimeSlots.map(slot => (
                                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">
                                                    {date ? "Aucun créneau disponible pour cette date." : "Veuillez sélectionner une date."}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <SubmitButton />
                        </form>
                    </CardContent>
                </Card>
            </main>
            <div className="w-full">
                <NewsletterSection />
            </div>
            <Footer />
        </div>
    );
}
