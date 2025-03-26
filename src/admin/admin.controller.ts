import { Controller, Get, Post, Body, Put, Param, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiHeader, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/constants/permissions';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserRole } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRoute } from '../auth/decorators/admin-route.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Roles([UserRole.SUPER_ADMIN])
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @AdminRoute(
    [UserRole.SUPER_ADMIN],
    [Permission.CREATE_ADMIN],
    'Tạo tài khoản admin mới'
  )
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  @ApiBody({
    type: CreateAdminDto,
    description: 'Thông tin tài khoản admin mới',
    examples: {
      example1: {
        summary: 'Tạo Content Admin',
        value: {
          name: 'Content Admin',
          email: 'content@example.com',
          password: 'password123',
          role: UserRole.CONTENT_ADMIN
        }
      },
      example2: {
        summary: 'Tạo Product Admin',
        value: {
          name: 'Product Admin',
          email: 'product@example.com',
          password: 'password123',
          role: UserRole.PRODUCT_ADMIN
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Admin đã được tạo thành công'
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
  @AdminRoute(
    [UserRole.SUPER_ADMIN],
    [Permission.UPDATE_ADMIN],
    'Cập nhật quyền cho admin'
  )
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