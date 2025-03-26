export interface IProduct {
  sku: string;
  name: string;
  slug: string;
  // ... các properties khác
}

export interface IProductResponse extends IProduct {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} 