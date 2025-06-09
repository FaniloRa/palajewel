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
