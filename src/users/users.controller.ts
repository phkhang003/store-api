import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from './interfaces/user.interface';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/constants/permissions';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @RequirePermissions(Permission.READ_USER)
  @ApiOperation({ summary: 'Lấy danh sách users' })
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
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_USER)
  @ApiOperation({ summary: 'Lấy thông tin user theo id' })
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
          enum: [
            'SUPER_ADMIN',
            'CONTENT_ADMIN',
            'PRODUCT_ADMIN', 
            'USER'
          ]
        },
        refreshToken: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: any
  ) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { 
          type: 'string', 
          enum: [
            'SUPER_ADMIN',
            'CONTENT_ADMIN',
            'PRODUCT_ADMIN', 
            'USER'
          ]
        },
        refreshToken: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_USER)
  @ApiOperation({ summary: 'Xóa user' })
  @ApiResponse({
    status: 200,
    description: 'Xóa user thành công',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async remove(@Param('id') id: string) {
    await this.authService.logout(id);
    return this.usersService.remove(id);
  }
}
