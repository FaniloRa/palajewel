
import { Loader2 } from 'lucide-react';

export default function Loading() {
  // Cette interface de chargement sera affichée en tant que solution de repli pendant le chargement du contenu de la page.
  return (
    <div className="flex h-full items-center justify-center p-16">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
