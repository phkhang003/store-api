import { Injectable } from '@nestjs/common';
import { IRole, IPermission } from '../interfaces/permission.interface';
import { PermissionService } from './permission.service';

@Injectable()
export class RoleService {
  private readonly roles: Map<string, IRole> = new Map();

  constructor(private permissionService: PermissionService) {
    this.initializeRoles();
  }

  private initializeRoles() {
    this.roles.set('SUPER_ADMIN', {
      name: 'SUPER_ADMIN',
      permissions: this.permissionService.getPermissionsForRole('SUPER_ADMIN')
    });

    this.roles.set('CONTENT_ADMIN', {
      name: 'CONTENT_ADMIN',
      permissions: this.permissionService.getPermissionsForRole('CONTENT_ADMIN')
    });

    this.roles.set('PRODUCT_ADMIN', {
      name: 'PRODUCT_ADMIN', 
      permissions: this.permissionService.getPermissionsForRole('PRODUCT_ADMIN')
    });

    this.roles.set('USER', {
      name: 'USER',
      permissions: this.permissionService.getPermissionsForRole('USER')
    });
  }

  getRolePermissions(role: string): IPermission[] {
    return this.roles.get(role)?.permissions || [];
  }

  validateRole(role: string): boolean {
    return this.roles.has(role);
  }
} 