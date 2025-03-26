import { Document } from 'mongoose';

export interface IEventProduct {
  productId: string;
  variantId?: string;
  adjustedPrice: number;
}

export interface IEvent extends Document {
  title: string;
  description?: string;
  tags: string[];
  startDate: Date;
  endDate: Date;
  products: IEventProduct[];
  createdAt: Date;
  updatedAt: Date;
} 