
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateSetting } from '@/app/actions/settingActions';

const initialState = { error: null, success: null };

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder
        </Button>
    );
};

export default function SettingsClientPage({ currentRate }: { currentRate: string | null }) {
    const { toast } = useToast();
    const [state, formAction] = useFormState(updateSetting, initialState);

    useEffect(() => {
        if (state.error) {
            toast({ title: 'Erreur', description: state.error, variant: 'destructive' });
        }
        if (state.success) {
            toast({ title: 'Succès', description: state.success });
        }
    }, [state, toast]);

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
                <CardDescription>Gérez les configurations de base de votre boutique.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Taux de Change</h3>
                        <p className="text-sm text-muted-foreground">
                            Définissez la valeur d'un Euro (EUR) en Ariary (MGA).
                        </p>
                    </div>
                    <div className="flex items-end gap-4">
                        <input type="hidden" name="key" value="exchangeRateEuroToMGA" />
                        <div className="flex items-center gap-2">
                            <div className="w-24">
                                <Label htmlFor="eur-rate">EUR</Label>
                                <Input id="eur-rate" value="1" disabled />
                            </div>
                            <ArrowRight className="h-5 w-5 mt-6 shrink-0 text-muted-foreground" />
                            <div className="flex-1">
                                <Label htmlFor="mga-rate">MGA</Label>
                                <Input
                                    id="mga-rate"
                                    name="value"
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 4750.50"
                                    defaultValue={currentRate || ''}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                     {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                    <div className="flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
