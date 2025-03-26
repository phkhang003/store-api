import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ShippingInfo {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  note?: string;
}

export const ShippingInfoSchema = SchemaFactory.createForClass(ShippingInfo); 