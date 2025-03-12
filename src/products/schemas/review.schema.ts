import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  images?: string[];

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  helpfulBy: Types.ObjectId[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review); 