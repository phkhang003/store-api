import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admin/admin.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperAdminCreationGuard } from './guards/super-admin-creation.guard';
import { UnauthorizedException } from '@nestjs/common';
import { SuperAdminService } from './services/super-admin.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
        
        if (!secret || !refreshSecret) {
          throw new UnauthorizedException('JWT secrets không được cấu hình đầy đủ trong file .env');
        }

        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    RefreshTokenStrategy, 
    SuperAdminCreationGuard,
    SuperAdminService
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
