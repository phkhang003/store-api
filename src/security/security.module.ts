import { Module, forwardRef } from '@nestjs/common';
import { SecurityService } from './security.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    SecurityService,
    PermissionService,
    RoleService,
    JwtStrategy,
    RefreshTokenStrategy,
    JwtAuthGuard,
    ApiKeyGuard,
    RateLimitGuard,
    PermissionGuard
  ],
  exports: [
    SecurityService,
    JwtModule,
    JwtAuthGuard,
    ApiKeyGuard,
    RateLimitGuard,
    PermissionGuard
  ]
})
export class SecurityModule {} 