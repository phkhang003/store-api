import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
      return false;
    }

    // Kiểm tra nếu user có role SUPER_ADMIN thì cho phép tất cả
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Kiểm tra role của user có nằm trong danh sách roles được yêu cầu không
    return requiredRoles.includes(user.role);
  }
} 