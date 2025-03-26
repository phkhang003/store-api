import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

@Schema()
export class SelectedOptions {
  @Prop()
  color?: string;

  @Prop()
  shade?: string;

  @Prop()
  size?: string;
}

@Schema()
export class CartItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariant' })
  variantId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ type: SelectedOptions })
  selectedOptions?: SelectedOptions;

  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ required: true, default: 0, min: 0 })
  totalAmount: number;
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.index({ userId: 1 }); 