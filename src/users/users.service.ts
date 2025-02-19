import { Injectable, NotFoundException, ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interfaces/user.interface';
import { SecurityService } from '../security/security.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private securityService: SecurityService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByRole(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const permissions = this.securityService.getPermissionsForRole(createUserDto.role);
    const hashedPassword = await this.hashPassword(createUserDto.password);
    
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      permissions
    });
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

  async update(id: string, updateUserDto: any): Promise<UserResponse> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true }
    );

    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    if (user.role !== UserRole.USER) {
      throw new UnauthorizedException('Không thể xóa tài khoản admin');
    }

    await this.userModel.findByIdAndDelete(id);
    return { message: 'Xóa user thành công' };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async toggleUserStatus(id: string): Promise<{ message: string; user: UserResponse }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    if (user.role !== UserRole.USER) {
      throw new UnauthorizedException('Không thể vô hiệu hóa tài khoản admin');
    }

    user.isActive = !user.isActive;
    await user.save();

    if (!user.isActive) {
      // Nếu vô hiệu hóa tài khoản thì logout user đó
      await this.updateRefreshToken(id, null);
    }

    return { 
      message: `Tài khoản đã được ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
      user: this.excludePassword(user)
    };
  }

  private excludePassword(user: UserDocument): UserResponse {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
}
