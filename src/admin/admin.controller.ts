import { Controller, Get, Post, Body, Put, Param, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/constants/permissions';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_ADMIN)
  @ApiOperation({ summary: 'Tạo tài khoản admin mới' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  async createAdmin(
    @Headers('x-api-key') apiKey: string,
    @Body() createAdminDto: CreateAdminDto
  ) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách admin' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  async getAdmins(@Headers('x-api-key') apiKey: string) {
    return this.adminService.getAdminList();
  }

  @Put(':id/permissions')
  @RequirePermissions(Permission.UPDATE_ADMIN)
  @ApiOperation({ summary: 'Cập nhật quyền cho admin' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  async updatePermissions(
    @Headers('x-api-key') apiKey: string,
    @Param('id') adminId: string,
    @Body('role') role: UserRole
  ) {
    return this.adminService.updateAdminPermissions(adminId, role);
  }
} 