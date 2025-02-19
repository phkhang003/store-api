import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuperAdminCreationGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate() {
    const allowCreation = this.configService.get<string>('ALLOW_SUPER_ADMIN_CREATION');
    if (allowCreation !== 'true') {
      throw new UnauthorizedException('Tính năng tạo SUPER_ADMIN đã bị vô hiệu hóa');
    }
    return true;
  }
}
