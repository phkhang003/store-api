import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  async onModuleInit() {
    const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const superAdminPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    if (!superAdminEmail || !superAdminPassword) {
      throw new Error('SUPER_ADMIN credentials not configured');
    }

    const existingSuperAdmin = await this.usersService.findByRole(UserRole.SUPER_ADMIN);
    
    if (existingSuperAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      await this.usersService.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN
      });
    }
  }
} 