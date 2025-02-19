import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BaseUserService {
  constructor(@InjectModel(User.name) protected userModel: Model<UserDocument>) {}

  protected async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  protected async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  protected async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
} 