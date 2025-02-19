import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Permission } from '../../auth/constants/permissions';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CONTENT_ADMIN = 'CONTENT_ADMIN',
  PRODUCT_ADMIN = 'PRODUCT_ADMIN',
  USER = 'USER'
}

@Schema({
  timestamps: true,
  collection: 'users'
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: UserRole,
    default: UserRole.USER 
  })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  permissions: Permission[];

  @Prop({ nullable: true })
  refreshToken?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
