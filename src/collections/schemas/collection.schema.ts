import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  productIds: Product[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection); 