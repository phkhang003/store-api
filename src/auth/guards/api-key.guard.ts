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
    const handlerRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const controllerRoles = this.reflector.get<UserRole[]>('roles', context.getClass());
    const roles = handlerRoles || controllerRoles;

    const adminRoles = [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN];
    
    // Nếu không phải admin role -> không cần API key
    if (!roles || !roles.some(role => adminRoles.includes(role))) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');

    this.logger.debug('API Key check:', {
      receivedKey: apiKey,
      validKey: validApiKey,
      headers: request.headers
    });
    
    if (!apiKey) {
      this.logger.error('Missing API key');
      throw new UnauthorizedException('API key không được tìm thấy');
    }

    if (!validApiKey) {
      this.logger.error('API_KEY not configured');
      throw new UnauthorizedException('API_KEY chưa được cấu hình');
    }

    if (apiKey !== validApiKey) {
      this.logger.error('Invalid API key');
      throw new UnauthorizedException('API key không hợp lệ');
    }

    return true;
  }
} 