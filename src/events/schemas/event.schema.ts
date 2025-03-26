import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';

export type EventDocument = Event & Document;

@Schema()
class EventProduct {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product.variants' })
  variantId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 0 })
  adjustedPrice: number;
}

@Schema({
  timestamps: true,
  collection: 'events'
})
export class Event extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop([String])
  tags: string[];

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ type: [EventProduct], required: true })
  products: EventProduct[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Thêm index cho tìm kiếm
EventSchema.index({ title: 'text', description: 'text', tags: 'text' }); 