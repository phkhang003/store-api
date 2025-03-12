import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Order } from '../../orders/schemas/order.schema';
import { PaymentStatus } from '../../orders/enums/order.enum';
import { PaymentMethod } from '../enums/payment.enum';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  returnUrl: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  transactionId?: string;

  @Prop()
  paidAt?: Date;

  @Prop()
  refundedAt?: Date;

  @Prop()
  paymentUrl: string;

  @Prop()
  errorMessage: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  completedAt: Date;

  @Prop({ required: true })
  paymentStatus: string;

  @Prop({ default: 'VND' })
  currency: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment); 