import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Type } from '../../types/schemas/type.schema';
import { Brand } from '../../brands/schemas/brand.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop()
  originalPrice: number;

  @Prop()
  discountPercentage: number;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  soldQuantity: number;

  @Prop({ required: true })
  stockQuantity: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: Category;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Type', required: true })
  typeId: Type;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand', required: true })
  brandId: Brand;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  extraAttributes: Record<string, any>;

  @Prop({ type: [String] })
  events: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product); 