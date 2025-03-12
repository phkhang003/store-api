import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { OrderStatus, PaymentStatus } from '../enums/order.enum';

export type OrderDocument = Order & Document;

export enum PaymentMethod {
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  VNPAY = 'vnpay'
}

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  name: string;
}

@Schema()
export class ShippingAddress {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop()
  ward: string;

  @Prop()
  zipCode: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    extraAttributes: Record<string, any>;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    zipCode?: string;
  };

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop()
  trackingNumber: string;

  @Prop({ type: Date, default: Date.now })
  orderedAt: Date;

  @Prop()
  deliveredAt: Date;

  @Prop()
  paymentId?: string;

  @Prop()
  couponCode?: string;

  @Prop()
  discount?: number;

  @Prop()
  notes?: string;

  @Prop()
  isGift?: boolean;

  @Prop()
  giftMessage?: string;

  @Prop()
  cancelReason?: string;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  returnReason?: string;

  @Prop({ type: [String] })
  returnImages?: string[];

  @Prop()
  returnRequestedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 