import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  contact: string;
}

export type BranchDocument = Branch & Document;
export const BranchSchema = SchemaFactory.createForClass(Branch);

// Tạo index cho tìm kiếm
BranchSchema.index({ name: 'text', address: 'text' }); 