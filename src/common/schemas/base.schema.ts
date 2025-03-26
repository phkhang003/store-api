import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  skipVersioning: {
    __v: true
  },
  suppressReservedKeysWarning: true
})
export class BaseSchema {
  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BaseSchemaFactory = SchemaFactory.createForClass(BaseSchema); 