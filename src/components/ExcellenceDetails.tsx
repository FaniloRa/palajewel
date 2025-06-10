import { ShieldCheck, Truck, CreditCard, Hourglass } from 'lucide-react';

const ExcellenceDetails = () => {
  const features = [
    {
      icon: <ShieldCheck size={36} className="mb-3 text-foreground" />,
      label: 'Livraison rapide',
    },
    {
      icon: <Truck size={36} className="mb-3 text-foreground" />,
      label: 'Service personnalisé',
    },
    {
      icon: <CreditCard size={36} className="mb-3 text-foreground" />,
      label: 'Paiement sécurisé',
    },
    {
      icon: <Hourglass size={36} className="mb-3 text-foreground" />,
      label: 'Paiement sécurisé', // Texte répété comme dans l'image
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* Left: Title */}
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              L&apos;Excellence jusque dans <br className="hidden sm:inline"/>les moindres détails
            </h2>
          </div>

          {/* Right: Features */}
          <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-6 lg:gap-10 w-full">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {feature.icon}
                <p className="font-body text-sm text-foreground/90">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExcellenceDetails;
