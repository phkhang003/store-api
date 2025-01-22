import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/schemas/user.schema';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new UnauthorizedException('Email đã tồn tại');
    }
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.USER
    });
    const tokens = await this.generateTokens(newUser);
    await this.updateRefreshToken(newUser._id.toString(), tokens.refresh_token);
    return tokens;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
    return tokens;
  }

  private async generateTokens(user: UserDocument) {
    const payload = { 
      email: user.email, 
      sub: user._id.toString(), 
      role: user.role 
    };
    
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
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

  async createAdminAccount(registerDto: RegisterDto) {
    const existingAdmin = await this.usersService.findByRole(UserRole.ADMIN);
    if (existingAdmin.length > 0) {
      throw new UnauthorizedException('Admin account đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.ADMIN
    });
    
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
}
