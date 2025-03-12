import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from './product.schema';

export type ProductSuggestionDocument = ProductSuggestion & Document;

@Schema({ timestamps: true })
export class ProductSuggestion {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  recentlyViewed: Product[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  recommended: Product[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  similarProducts: Product[];

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;
}

export const ProductSuggestionSchema = SchemaFactory.createForClass(ProductSuggestion); 