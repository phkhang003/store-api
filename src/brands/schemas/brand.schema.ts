import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand); 