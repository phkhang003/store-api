import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { InventoryOperation } from '../dto/update-inventory.dto';

export type InventoryLogDocument = InventoryLog & Document;

@Schema({ timestamps: true })
export class InventoryLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  previousStock: number;

  @Prop({ required: true })
  newStock: number;

  @Prop({ enum: InventoryOperation, required: true })
  operation: InventoryOperation;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  reason: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;
}

export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog); 