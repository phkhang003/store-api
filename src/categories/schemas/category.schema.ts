import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null })
  parentId: Category | null;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  icon: string;

  @Prop({ default: 0 })
  productCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category); 