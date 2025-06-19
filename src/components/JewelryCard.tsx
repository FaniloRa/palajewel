import Image from 'next/image';
import type { Jewelry } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface JewelryCardProps {
  item: Jewelry;
}

const JewelryCard: React.FC<JewelryCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full bg-card text-card-foreground">
      <CardHeader className="p-0">
        <div className="relative w-full h-64 group">
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            fill
            style={{objectFit: "cover"}}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={item.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-2 text-card-foreground">{item.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Tag size={16} className="mr-1 text-primary" />
          <span>{item.type}</span>
        </div>
        <p className="font-body text-card-foreground/80 text-sm mb-2 line-clamp-3">{item.description || 'A beautiful piece of jewelry.'}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-border mt-auto">
        <p className="font-body text-lg font-semibold text-primary">{item.price.toFixed(2)} €</p>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JewelryCard;
