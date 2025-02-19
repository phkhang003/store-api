import { Injectable } from '@nestjs/common';
import { IPermission, createPermission } from '../interfaces/permission.interface';

@Injectable()
export class PermissionService {
  private readonly permissions: Map<string, IPermission[]> = new Map();
  private adminPermissions: IPermission[];
  private contentPermissions: IPermission[];
  private productPermissions: IPermission[];
  private userPermissions: IPermission[];

  constructor() {
    this.initializePermissionSets();
    this.initializeRolePermissions();
  }

  private initializePermissionSets() {
    this.adminPermissions = [
      createPermission('admin', 'create'),
      createPermission('admin', 'read'),
      createPermission('admin', 'update'),
      createPermission('admin', 'delete'),
    ];

    this.contentPermissions = [
      createPermission('content', 'create'),
      createPermission('content', 'read'),
      createPermission('content', 'update'),
      createPermission('content', 'delete'),
    ];

    this.productPermissions = [
      createPermission('product', 'create'),
      createPermission('product', 'read'),
      createPermission('product', 'update'),
      createPermission('product', 'delete'),
    ];

    this.userPermissions = [
      createPermission('content', 'read'),
      createPermission('product', 'read'),
    ];
  }

  private initializeRolePermissions() {
    this.permissions.set('SUPER_ADMIN', [
      ...this.adminPermissions,
      ...this.contentPermissions,
      ...this.productPermissions
    ]);

    this.permissions.set('CONTENT_ADMIN', [
      ...this.contentPermissions,
      createPermission('product', 'read'),
      createPermission('user', 'read')
    ]);

    this.permissions.set('PRODUCT_ADMIN', [
      ...this.productPermissions,
      createPermission('content', 'read'),
      createPermission('user', 'read')
    ]);

    this.permissions.set('USER', [...this.userPermissions]);
  }

  getPermissionsForRole(role: string): IPermission[] {
    return this.permissions.get(role) || [];
  }
} 