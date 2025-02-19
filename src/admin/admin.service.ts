import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserRole } from '../users/schemas/user.schema';
import { Permission, RolePermissions } from '../auth/constants/permissions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    if (![UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN].includes(createAdminDto.role)) {
      throw new UnauthorizedException('Role không hợp lệ');
    }

    const existingAdmin = await this.usersService.findByRole(createAdminDto.role);
    if (existingAdmin.length > 0) {
      throw new UnauthorizedException(`${createAdminDto.role} đã tồn tại`);
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    return this.usersService.create({
      ...createAdminDto,
      password: hashedPassword,
      permissions: RolePermissions[createAdminDto.role]
    });
  }

  async getAdminList() {
    const adminRoles = [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN];
    const admins = [];
    for (const role of adminRoles) {
      const adminsByRole = await this.usersService.findByRole(role);
      admins.push(...adminsByRole);
    }
    return admins;
  }

  async updateAdminPermissions(adminId: string, role: UserRole) {
    const admin = await this.usersService.findOne(adminId);
    if (!admin) {
      throw new UnauthorizedException('Admin không tồn tại');
    }
    
    admin.permissions = RolePermissions[role];
    return this.usersService.update(adminId, admin);
  }
} 