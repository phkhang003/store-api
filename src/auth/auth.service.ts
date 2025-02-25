import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/schemas/user.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { Permission, Role, RolePermissions } from './constants/permissions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new UnauthorizedException('Email đã tồn tại');
    }
    
    const userPermissions = RolePermissions[UserRole.USER];
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.USER,
      permissions: userPermissions
    });
    
    const tokens = await this.generateTokens(newUser);
    await this.updateRefreshToken(newUser._id.toString(), tokens.refresh_token);
    return tokens;
  }

  async login(loginDto: LoginDto, isAdminLogin: boolean = false) {
    const logger = new Logger('AuthService');
    
    logger.debug('Login attempt:', {
      dto: loginDto,
      isAdminLogin
    });

    const user = await this.usersService.findByEmail(loginDto.email);
    
    logger.debug('Found user:', {
      id: user?._id,
      email: user?.email,
      role: user?.role,
      hashedPassword: user?.password
    });

    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    logger.debug('Password validation:', {
      isValid: isPasswordValid,
      providedPassword: loginDto.password,
      hashedPassword: user.password
    });

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    if (isAdminLogin) {
      await this.validateAdminRole(user, null);
    } else {
      if (user.role !== UserRole.USER) {
        throw new UnauthorizedException('Vui lòng sử dụng trang đăng nhập admin');
      }
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Đăng xuất thành công' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
    return tokens;
  }

  private async generateTokens(user: UserDocument) {
    const payload = { 
      sub: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
    
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'), 
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async validateAdminRole(user: UserDocument, requiredRole: UserRole) {
    const logger = new Logger('AuthService');
    
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    logger.debug('Validating admin role:', {
      userRole: user.role,
      requiredRole: requiredRole
    });

    const adminRoles = [
      UserRole.SUPER_ADMIN,
      UserRole.CONTENT_ADMIN,
      UserRole.PRODUCT_ADMIN
    ];

    if (!adminRoles.includes(user.role)) {
      logger.error(`Invalid role: ${user.role}`);
      throw new UnauthorizedException('Tài khoản không có quyền admin');
    }

    if (requiredRole && user.role !== requiredRole) {
      logger.error(`Role mismatch: ${user.role} vs ${requiredRole}`);
      throw new UnauthorizedException(`Tài khoản không có quyền ${requiredRole}`);
    }

    return true;
  }

  async checkAdminAccount() {
    const logger = new Logger('AuthService');
    
    const adminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const admin = await this.usersService.findByEmail(adminEmail);
    
    logger.debug('Admin account check:', {
      exists: !!admin,
      email: adminEmail,
      role: admin?.role,
      hashedPassword: admin?.password
    });

    return !!admin;
  }
}
