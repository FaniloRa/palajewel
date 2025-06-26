
import Image from 'next/image';

interface BannerContent {
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
}

const bannerData: Record<string, BannerContent> = {
  Montre: {
    title: 'Nos montres',
    description: 'Nos montres allient élégance et précision pour sublimer votre style',
    imageUrl: 'https://placehold.co/1200x350.png',
    dataAiHint: 'luxury watch closeup',
  },
  Bague: {
    title: 'Nos Bagues',
    description: 'Découvrez des créations uniques pour orner vos mains avec élégance',
    imageUrl: 'https://placehold.co/1200x350.png',
    dataAiHint: 'rings jewelry hand',
  },
  Bracelet: {
    title: 'Nos Bracelets',
    description: 'Des pièces délicates pour habiller votre poignet en toute occasion',
    imageUrl: 'https://placehold.co/1200x350.png',
    dataAiHint: 'jewelry bracelet wrist',
    },
};

interface CategoryBannerProps {
  category: string;
}

const CategoryBanner = ({ category }: CategoryBannerProps) => {
  const content = bannerData[category];

  if (!content) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="relative w-full h-[250px] md:h-[350px]">
        <Image
          src={content.imageUrl}
          alt={`Bannière pour la catégorie ${content.title}`}
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint={content.dataAiHint}
          priority
        />
      </div>
      <div className="text-center my-10 md:my-12 px-4">
        <h1 className="font-headline text-3xl md:text-4xl text-background mb-4">
          {content.title}
        </h1>
        <div className="flex justify-center mb-4">
          <div className="w-24 h-px bg-slate-300"></div>
        </div>
        <p className="font-body text-base text-slate-600 max-w-lg mx-auto">
          {content.description}
        </p>
      </div>
    </section>
  );
};

export default CategoryBanner;
