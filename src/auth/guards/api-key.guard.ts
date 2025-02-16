import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedException('API key không được tìm thấy');
    }

    const validApiKey = this.configService.get<string>('API_KEY');
    if (!validApiKey) {
      throw new UnauthorizedException('API_KEY chưa được cấu hình trong file .env');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('API key không hợp lệ');
    }

    return true;
  }
} 