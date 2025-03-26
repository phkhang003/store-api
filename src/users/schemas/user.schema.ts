import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from '../../auth/enums/role.enum';
import { BaseSchema } from '../../common/schemas/base.schema';

export type UserDocument = User & Document;

@Schema()
class Address {
  @Prop({ required: true })
  addressId: string;

  @Prop({ required: true })
  addressLine: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  postalCode?: string;

  @Prop({ required: true, default: false })
  isDefault: boolean;
}

@Schema({
  timestamps: true,
  collection: 'users',
  suppressReservedKeysWarning: true
})
export class User extends BaseSchema {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  googleId?: string;

  @Prop({ type: [{ type: Address }], default: [] })
  addresses: Address[];

  @Prop({ 
    type: String,
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  wishlist: MongooseSchema.Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ select: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
