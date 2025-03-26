import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';

class Logo {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  alt: string;
}

class SocialMedia {
  @Prop()
  facebook?: string;

  @Prop()
  instagram?: string;

  @Prop()
  youtube?: string;
}

@Schema({
  timestamps: true,
  collection: 'brands',
  suppressReservedKeysWarning: true
})
export class Brand extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Logo, required: true })
  logo: Logo;

  @Prop()
  origin?: string;

  @Prop()
  website?: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: string;

  @Prop({ type: SocialMedia, default: {} })
  socialMedia: SocialMedia;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Thêm text index cho tìm kiếm
BrandSchema.index({ name: 'text', description: 'text' }); 