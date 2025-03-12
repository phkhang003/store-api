import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  title: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isVerifiedPurchase: boolean;

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  helpfulBy: MongooseSchema.Types.ObjectId[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  adminReply: string;

  @Prop()
  adminReplyDate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review); 