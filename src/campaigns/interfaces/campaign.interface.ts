import { Document } from 'mongoose';

export interface ICampaignProduct {
  productId: string;
  variantId?: string;
  adjustedPrice: number;
}

export interface ICampaign extends Document {
  title: string;
  description?: string;
  type: 'Hero Banner' | 'Sale Event';
  startDate: Date;
  endDate: Date;
  products: ICampaignProduct[];
  createdAt: Date;
  updatedAt: Date;
} 