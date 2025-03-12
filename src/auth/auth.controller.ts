import { Controller, Post, Body, UseGuards, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from 'jsonwebtoken';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiKeyAuth } from './decorators/api-key.decorator';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { Permission } from './constants/permissions';
import { SuperAdminCreationGuard } from './guards/super-admin-creation.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AdminService } from '../admin/admin.service';
import { Roles } from './decorators/roles.decorator';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private adminService: AdminService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({
    type: RegisterDto,
    description: 'Thông tin đăng ký tài khoản',
    examples: {
      example1: {
        summary: 'Đăng ký user',
        value: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('admin/login')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN)
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Đăng nhập tài khoản admin' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Thông tin đăng nhập admin',
    examples: {
      example1: {
        summary: 'Đăng nhập admin',
        value: {
          email: 'admin@example.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập admin thành công',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      }
    }
  })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, true);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập cho user' })
  @ApiBody({
    type: LoginDto,
    description: 'Thông tin đăng nhập',
    examples: {
      example1: {
        summary: 'Đăng nhập user',
        value: {
          email: 'user@example.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Làm mới access token' })
  async refreshToken(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đăng xuất' })
  async logout(@GetCurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('check-admin')
  @ApiOperation({ summary: 'Kiểm tra tài khoản admin' })
  async checkAdmin() {
    return this.authService.checkAdminAccount();
  }

}
