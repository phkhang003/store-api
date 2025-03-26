import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';

export type ReviewDocument = Review & Document;

@Schema()
class ReviewImage {
  @Prop({ required: true })
  url: string;

  @Prop()
  alt?: string;
}

@Schema()
class ReviewReply {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

@Schema({
  timestamps: true,
  collection: 'reviews',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Review extends BaseSchema {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product.variants' })
  variantId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [ReviewImage], default: [] })
  images: ReviewImage[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: string;

  @Prop({ type: [ReviewReply], default: [] })
  reply: ReviewReply[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Thêm virtual field để populate user info
ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
}); 