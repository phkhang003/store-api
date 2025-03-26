import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';

export type OrderTrackingDocument = OrderTracking & Document;

@Schema()
class TrackingStatus {
  @Prop({ 
    type: String,
    enum: OrderStatus,
    required: true 
  })
  state: OrderStatus;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop()
  location?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  updatedBy: MongooseSchema.Types.ObjectId;
}

@Schema()
class ShippingCarrier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  trackingNumber: string;

  @Prop()
  trackingUrl?: string;
}

@Schema({ timestamps: true })
export class OrderTracking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [TrackingStatus], default: [] })
  status: TrackingStatus[];

  @Prop({ type: ShippingCarrier })
  shippingCarrier?: ShippingCarrier;

  @Prop()
  estimatedDelivery?: Date;

  @Prop()
  actualDelivery?: Date;
}

export const OrderTrackingSchema = SchemaFactory.createForClass(OrderTracking);

// Tạo indexes
OrderTrackingSchema.index({ orderId: 1 }, { unique: true });
OrderTrackingSchema.index({ 'status.timestamp': -1 }); 