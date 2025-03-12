import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  items: {
    productId: string;
    quantity: number;
    extraAttributes: Record<string, any>;
  }[];

  @Prop({ required: true })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart); 