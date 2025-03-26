import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';

@Schema()
export class ProductOptions {
  @Prop()
  shade?: string;

  @Prop()
  size?: string;
}

@Schema()
export class OrderProduct {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariant' })
  variantId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: ProductOptions })
  options: ProductOptions;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema()
export class VoucherInfo {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Voucher', required: true })
  voucherId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 0 })
  discountAmount: number;
}

@Schema()
export class ShippingInfo {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  contact: string;
}

@Schema({
  timestamps: true,
  suppressReservedKeysWarning: true
})
export class Order extends BaseSchema {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [OrderProduct], required: true })
  products: OrderProduct[];

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ type: VoucherInfo })
  voucher?: VoucherInfo;

  @Prop({ required: true, min: 0 })
  finalPrice: number;

  @Prop({ 
    required: true,
    enum: ['pending', 'shipped', 'completed', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @Prop({ type: ShippingInfo, required: true })
  shippingInfo: ShippingInfo;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true })
  branchId: MongooseSchema.Types.ObjectId;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);

// Tạo indexes
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 }); 