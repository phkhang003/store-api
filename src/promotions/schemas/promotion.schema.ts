import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PromotionDocument = Promotion & Document;

export enum DiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage'
}

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: DiscountType })
  discountType: DiscountType;

  @Prop({ required: true })
  discountValue: number;

  @Prop()
  maxDiscount?: number;

  @Prop({ required: true })
  minOrderAmount: number;

  @Prop()
  maxUsage?: number;

  @Prop()
  userMaxUsage?: number;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  firstOrderOnly: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  usedBy: Types.ObjectId[];
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion); 