import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  collection: 'products',
  suppressReservedKeysWarning: true
})
export class Product extends BaseSchema {
  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    type: {
      short: String,
      full: String
    }
  })
  description: {
    short: string;
    full: string;
  };

  @Prop({
    type: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    }
  })
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number })
  currentPrice: number;

  @Prop({ 
    required: true,
    enum: ['active', 'out_of_stock', 'discontinued'],
    default: 'active'
  })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brandId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  categoryIds: MongooseSchema.Types.ObjectId[];

  @Prop([String])
  tags: string[];

  @Prop({
    type: {
      skinType: [String],
      concerns: [String],
      ingredients: [String],
      volume: {
        value: Number,
        unit: String
      },
      usage: String,
      madeIn: String,
      expiry: {
        shelf: Number,
        afterOpening: Number
      }
    }
  })
  cosmetic_info: {
    skinType: string[];
    concerns: string[];
    ingredients: string[];
    volume: {
      value: number;
      unit: string;
    };
    usage: string;
    madeIn: string;
    expiry: {
      shelf: number;
      afterOpening: number;
    };
  };

  @Prop([{
    variantId: { type: MongooseSchema.Types.ObjectId },
    sku: String,
    options: {
      color: String,
      shade: String,
      size: String
    },
    price: Number,
    images: [String]
  }])
  variants: Array<{
    variantId: MongooseSchema.Types.ObjectId;
    sku: string;
    options: {
      color: string;
      shade: string;
      size: string;
    };
    price: number;
    images: string[];
  }>;

  @Prop([{
    url: String,
    alt: String,
    isPrimary: Boolean
  }])
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;

  @Prop([{
    branchId: { type: MongooseSchema.Types.ObjectId, ref: 'Branch' },
    quantity: Number,
    lowStockThreshold: Number
  }])
  inventory: Array<{
    branchId: MongooseSchema.Types.ObjectId;
    quantity: number;
    lowStockThreshold: number;
  }>;

  @Prop({
    type: {
      averageRating: Number,
      reviewCount: Number
    }
  })
  reviews: {
    averageRating: number;
    reviewCount: number;
  };

  @Prop({
    type: {
      isBestSeller: Boolean,
      isNew: Boolean,
      isOnSale: Boolean,
      hasGifts: Boolean
    }
  })
  flags: {
    isBestSeller: boolean;
    isNew: boolean;
    isOnSale: boolean;
    hasGifts: boolean;
  };

  @Prop([{
    giftId: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
    name: String,
    description: String,
    image: {
      url: String,
      alt: String
    },
    quantity: Number,
    value: Number,
    type: {
      type: String,
      enum: ['product', 'sample', 'voucher', 'other']
    },
    conditions: {
      minPurchaseAmount: Number,
      minQuantity: Number,
      startDate: Date,
      endDate: Date,
      limitedQuantity: Number
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock']
    }
  }])
  gifts: Array<{
    giftId: MongooseSchema.Types.ObjectId;
    name: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
    quantity: number;
    value: number;
    type: string;
    conditions: {
      minPurchaseAmount: number;
      minQuantity: number;
      startDate: Date;
      endDate: Date;
      limitedQuantity: number;
    };
    status: string;
  }>;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  relatedProducts: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Event' }] })
  relatedEvents: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Campaign' }] })
  relatedCampaigns: MongooseSchema.Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);