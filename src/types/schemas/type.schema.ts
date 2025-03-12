import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type TypeDocument = Type & Document;

@Schema({ timestamps: true })
export class Type {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  attributes: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categoryId: Category;
}

export const TypeSchema = SchemaFactory.createForClass(Type); 