export interface Jewelry {
  id: string;
  name: string;
  type: JewelryTypeOption;
  price: number;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  featured?: boolean;
  dataAiHint: string;
}

export type JewelryTypeOption = 'Necklace' | 'Ring' | 'Earrings' | 'Bracelet';
export type FilterTypeOption = 'All' | JewelryTypeOption;


export type SortOption = 'default' | 'price-asc' | 'price-desc';

export interface FeaturedProduct {
  id: string;
  name: string;
  imageUrl: string;
  imageAlt: string;
  viewMoreLink: string;
  dataAiHint: string;
}

export interface OurProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  dataAiHint: string;
}
