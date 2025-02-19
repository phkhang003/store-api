import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handlerRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const controllerRoles = this.reflector.get<UserRole[]>('roles', context.getClass());
    const roles = handlerRoles || controllerRoles;

    const adminRoles = [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN];
    
    if (!roles || !roles.some(role => adminRoles.includes(role))) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedException('API key không được tìm thấy');
    }

    const validApiKey = this.configService.get<string>('API_KEY');
    if (!validApiKey) {
      throw new UnauthorizedException('API_KEY chưa được cấu hình');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('API key không hợp lệ');
    }

    return true;
  }
} 