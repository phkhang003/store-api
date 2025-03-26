import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';
import mongoose from 'mongoose';

export type CampaignDocument = Campaign & Document;

class CampaignProduct {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  productId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product.variants' })
  variantId?: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  adjustedPrice: number;
}

@Schema({
  timestamps: true,
  collection: 'campaigns',
  suppressReservedKeysWarning: true
})
export class Campaign extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: ['Hero Banner', 'Sale Event'],
    required: true
  })
  type: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ type: [CampaignProduct], default: [] })
  products: CampaignProduct[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

// Thêm index cho tìm kiếm
CampaignSchema.index({ title: 'text', description: 'text' });
// Index cho date range queries
CampaignSchema.index({ startDate: 1, endDate: 1 });