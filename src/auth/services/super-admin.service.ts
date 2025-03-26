import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminService.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  async onModuleInit() {
    try {
      const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
      const superAdminPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

      this.logger.debug('Checking SuperAdmin configuration:', {
        email: superAdminEmail,
        hasPassword: !!superAdminPassword
      });

      if (!superAdminEmail || !superAdminPassword) {
        throw new Error('SUPER_ADMIN credentials not configured');
      }

      const existingSuperAdmin = await this.usersService.findByRole(UserRole.SUPER_ADMIN);
      
      if (existingSuperAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
        
        const newAdmin = await this.usersService.createAdmin({
          name: 'Super Admin',
          email: superAdminEmail,
          password: hashedPassword,
          role: UserRole.SUPER_ADMIN
        });
        
        this.logger.debug('Created new SuperAdmin:', {
          id: newAdmin._id,
          email: newAdmin.email,
          role: newAdmin.role
        });
      }
    } catch (error) {
      this.logger.error('Error in SuperAdminService:', error);
      throw error;
    }
  }

  async createSuperAdmin() {
    const email = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    this.logger.debug('Creating super admin with:', {
      email,
      password: '***' // Hide actual password in logs
    });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const superAdmin = await this.usersService.create({
        email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        name: 'Super Admin',
        phone: '' // Thêm trường phone
      });

      this.logger.debug('Super admin created successfully:', {
        id: superAdmin._id,
        email: superAdmin.email,
        role: superAdmin.role
      });

      return superAdmin;
    } catch (error) {
      this.logger.error('Failed to create super admin:', error);
      throw error;
    }
  }
} 