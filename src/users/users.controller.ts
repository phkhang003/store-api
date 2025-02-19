import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UnauthorizedException, NotFoundException, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from './interfaces/user.interface';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission, RolePermissions } from '../auth/constants/permissions';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiKeyAuth } from '../auth/decorators/api-key.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách users' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  async findAll(@Headers('x-api-key') apiKey: string) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin user theo id' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin user',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { 
          type: 'string', 
          enum: ['SUPER_ADMIN', 'CONTENT_ADMIN', 'PRODUCT_ADMIN', 'USER']
        },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  async findOne(
    @Headers('x-api-key') apiKey: string,
    @Param('id') id: string,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Admin cập nhật thông tin user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/status')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Vô hiệu hóa/Kích hoạt tài khoản user' })
  async toggleUserStatus(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    return this.usersService.toggleUserStatus(id);
  }
}
