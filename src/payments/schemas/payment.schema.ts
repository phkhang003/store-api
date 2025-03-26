import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

@Schema()
class PaymentDetails {
  @Prop()
  cardLast4?: string;

  @Prop()
  bankName?: string;

  @Prop()
  accountNumber?: string;
}

@Schema()
class RefundHistory {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  processedAt: Date;
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentMethod })
  method: PaymentMethod;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  transactionId: string;

  @Prop({ type: PaymentDetails })
  paymentDetails: PaymentDetails;

  @Prop({ type: [RefundHistory], default: [] })
  refundHistory: RefundHistory[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);