import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  collection: 'categories'
})
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 1 })
  level: number;

  @Prop({
    type: {
      url: String,
      alt: String
    }
  })
  image: {
    url: string;
    alt: string;
  };

  @Prop({ 
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category); 