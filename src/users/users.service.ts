import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByRole(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return user;
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.excludePassword(user));
  }

  async update(id: string, updateUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return this.excludePassword(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Không thể xóa tài khoản SUPER_ADMIN');
    }
    await this.userModel.findByIdAndDelete(id);
    return { message: 'Xóa user thành công' };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  private excludePassword(user: UserDocument): UserResponse {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
