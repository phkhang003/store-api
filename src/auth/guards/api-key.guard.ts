import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/role.enum';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  
  constructor(
    private configService: ConfigService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.getRoles(context);
    const adminRoles = [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN];
    
    if (!roles || !roles.some(role => adminRoles.includes(role))) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');

    if (!apiKey || typeof apiKey !== 'string') {
      this.logger.error('Missing or invalid API key');
      throw new UnauthorizedException('API key không hợp lệ');
    }

    if (!validApiKey) {
      this.logger.error('API_KEY not configured in environment');
      throw new UnauthorizedException('API_KEY chưa được cấu hình');
    }

    if (apiKey.length < 32) {
      this.logger.error('Invalid API key length');
      throw new UnauthorizedException('API key không đủ độ dài yêu cầu');
    }

    return true;
  }

  private getRoles(context: ExecutionContext): UserRole[] {
    const handlerRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const controllerRoles = this.reflector.get<UserRole[]>('roles', context.getClass());
    return handlerRoles || controllerRoles;
  }
} 