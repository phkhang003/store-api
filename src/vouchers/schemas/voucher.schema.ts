import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../../common/schemas/base.schema';

export type VoucherDocument = Voucher & Document;

@Schema({
  timestamps: true,
  collection: 'vouchers',
  suppressReservedKeysWarning: true
})
export class Voucher extends BaseSchema {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  })
  discountType: string;

  @Prop({ required: true, min: 0 })
  discountValue: number;

  @Prop({ required: true, min: 0 })
  minimumOrderValue: number;

  @Prop({ required: true, min: 0 })
  maxDiscount: number;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ required: true, min: 1 })
  usageLimit: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  usedByUsers: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }])
  applicableProducts: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }])
  applicableCategories: MongooseSchema.Types.ObjectId[];
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);

// Index cho tìm kiếm
VoucherSchema.index({ code: 'text', description: 'text' });
// Index cho date range queries
VoucherSchema.index({ startDate: 1, endDate: 1 }); 