export type ProductCategory = 
  | 'girls' 
  | 'boys' 
  | 'dresses-partywear' 
  | 'matching-sets' 
  | 'birthday' 
  | 'baby' 
  | 'shoes-accessories';

export type ProductGender = 'girls' | 'boys' | 'unisex';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  categoryLabel: string;
  gender: ProductGender;
  ageRange: string; // e.g. "1-3 Years", "4-6 Years", "7-9 Years", "10-13 Years"
  ageMin: number;
  ageMax: number;
  price: number; // in NGN ₦
  originalPrice?: number;
  images: string[];
  availableSizes: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  fabricDetails: string;
  careInstructions: string[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}
