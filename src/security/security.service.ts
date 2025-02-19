import { Injectable, ExecutionContext } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { IPermission } from './interfaces/permission.interface';

@Injectable()
export class SecurityService {
  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) {}

  getPermissionsForRole(role: string): IPermission[] {
    return this.roleService.getRolePermissions(role);
  }

  validatePermissions(userPermissions: IPermission[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(required => {
      const [resource, action] = required.split(':');
      return userPermissions.some(
        p => p.resource === resource && p.action === action
      );
    });
  }

  validateRequest(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) return false;

    const requiredPermissions = this.getRequiredPermissions(context);
    if (!requiredPermissions) return true;

    const userPermissions = this.getPermissionsForRole(user.role);
    return this.validatePermissions(userPermissions, requiredPermissions);
  }

  private getRequiredPermissions(context: ExecutionContext): string[] | null {
    const handler = context.getHandler();
    const permissions = Reflect.getMetadata('permissions', handler);
    return permissions || null;
  }
} 