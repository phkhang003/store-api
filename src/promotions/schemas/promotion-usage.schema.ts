import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PromotionUsageDocument = PromotionUsage & Document;

@Schema({ timestamps: true })
export class PromotionUsage {
  @Prop({ type: Types.ObjectId, ref: 'Promotion', required: true })
  promotionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  discountAmount: number;
}

export const PromotionUsageSchema = SchemaFactory.createForClass(PromotionUsage); 