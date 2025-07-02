
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

export interface ICategory {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OurProduct {
  id:string;
  name: string;
  description: string;
  price: number; // Changed from string to number
  imageUrl: string; // This will be used for the listing card
  imageAlt: string;
  dataAiHint: string;
  sku: string;
  category: ICategory | string;
  detailedDescription?: string; // For longer description on product page
  mainImageUrl: string; // For product detail page
  thumbnailImageUrl1: string; // For product detail page
  thumbnailImageUrl2: string; // For product detail page
  stock: number;
  status: 'active' | 'draft';
  featured?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: OurProduct;
  quantity: number;
}
