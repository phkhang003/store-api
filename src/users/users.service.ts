import { Injectable, NotFoundException, ConflictException, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from '../auth/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interfaces/user.interface';
import { SecurityService } from '../security/security.service';
import * as bcrypt from 'bcrypt';
import { AddressDto } from './dto/address.dto';
import { v4 as uuidv4 } from 'uuid';

export interface IAddress {
  addressId: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

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
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByRole(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
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

  async toggleUserStatus(id: string, currentUser: any) {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    if (user.role !== UserRole.USER) {
      throw new UnauthorizedException('Không thể vô hiệu hóa tài khoản admin');
    }

    user.isActive = !user.isActive;
    await user.save();

    return {
      message: `Tài khoản đã được ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
      isActive: user.isActive
    };
  }

  private excludePassword(user: UserDocument): UserResponse {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Người dùng với ID ${id} không tồn tại`);
    }
    return user;
  }

  async createAdmin(adminData: {
    name: string;
    email: string;
    password: string; // Đã được hash
    role: UserRole;
  }): Promise<UserDocument> {
    const permissions = this.securityService.getPermissionsForRole(adminData.role);
    
    const newAdmin = new this.userModel({
      ...adminData,
      permissions,
      isActive: true
    });
    
    return newAdmin.save();
  }

  async addToWishlist(userId: string, productId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    const productObjectId = new MongooseSchema.Types.ObjectId(productId);
    
    if (!user.wishlist.some(id => id.toString() === productObjectId.toString())) {
      user.wishlist.push(productObjectId);
      await user.save();
    }
    return user;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    const productObjectId = new MongooseSchema.Types.ObjectId(productId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productObjectId.toString());
    return user.save();
  }

  async addAddress(userId: string, addressDto: AddressDto): Promise<UserDocument> {
    const user = await this.findById(userId);
    const address: IAddress = {
      addressId: uuidv4(),
      addressLine: addressDto.addressLine,
      city: addressDto.city,
      state: addressDto.state,
      country: addressDto.country,
      postalCode: addressDto.postalCode,
      isDefault: addressDto.isDefault || false
    };
    
    if (address.isDefault) {
      user.addresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    user.addresses.push(address);
    return user.save();
  }

  async updateAddress(userId: string, addressId: string, addressDto: AddressDto): Promise<UserDocument> {
    const user = await this.findById(userId);
    const addressIndex = user.addresses.findIndex(addr => addr.addressId === addressId);
    
    if (addressIndex === -1) {
      throw new NotFoundException('Địa chỉ không tồn tại');
    }

    const updatedAddress: IAddress = {
      ...user.addresses[addressIndex],
      ...addressDto,
      addressId // Giữ nguyên addressId cũ
    };

    if (addressDto.isDefault) {
      user.addresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }

    user.addresses[addressIndex] = updatedAddress;
    return user.save();
  }

  async removeAddress(userId: string, addressId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    user.addresses = user.addresses.filter(addr => addr.addressId !== addressId);
    return user.save();
  }
}
