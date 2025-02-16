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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('register')
  @ApiKeyAuth({ limit: 5, ttl: 60 })
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({
    type: RegisterDto,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'Tên người dùng'
        },
        email: {
          type: 'string',
          example: 'john@example.com',
          description: 'Email đăng nhập'
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'Mật khẩu (tối thiểu 6 ký tự)'
        }
      },
      required: ['name', 'email', 'password']
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

  @Post('login')
  @ApiKeyAuth({ limit: 20, ttl: 60 })
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({
    type: LoginDto,
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'john@example.com',
          description: 'Email đăng nhập'
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'Mật khẩu'
        }
      },
      required: ['email', 'password']
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

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Làm mới access token' })
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Đăng xuất' })
  async logout(@GetCurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @Post('create-admin')
  @RequirePermissions(Permission.CREATE_ADMIN)
  @ApiOperation({ summary: 'Tạo tài khoản Admin' })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    return this.authService.createAdminAccount(createAdminDto);
  }

}
