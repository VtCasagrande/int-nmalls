export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
}

export interface ProductImage {
  url: string;
  isMain: boolean;
  alt?: string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  name: string;
  price: number;
  comparePrice?: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock: number;
  categoryId?: string;
  categoryName?: string;
  images: ProductImage[];
  status: ProductStatus;
  hasVariants: boolean;
  variants?: ProductVariant[];
  attributes?: {
    [key: string]: string;
  };
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
} 