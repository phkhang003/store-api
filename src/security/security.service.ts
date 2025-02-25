import { Injectable, ExecutionContext } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { IPermission } from './interfaces/permission.interface';
import { ROLE_PERMISSIONS } from './constants/role-permissions';
import { Permission } from '../auth/constants/permissions';

@Injectable()
export class SecurityService {
  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) {}

  getPermissionsForRole(role: string): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  validatePermissions(userRole: string, requiredPermissions: Permission[]): boolean {
    const userPermissions = this.getPermissionsForRole(userRole);
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  }

  validateRequest(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) return false;

    const requiredPermissions = this.getRequiredPermissions(context);
    if (!requiredPermissions) return true;

    const userPermissions = this.getPermissionsForRole(user.role);
    return this.validatePermissions(user.role, requiredPermissions);
  }

  private getRequiredPermissions(context: ExecutionContext): Permission[] | null {
    const handler = context.getHandler();
    const permissions = Reflect.getMetadata('permissions', handler);
    return permissions || null;
  }
} 