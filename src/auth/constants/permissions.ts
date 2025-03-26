import { UserRole } from '../enums/role.enum';

export enum Permission {
  // Product permissions
  CREATE_PRODUCT = 'products:create',
  READ_PRODUCT = 'products:read',
  UPDATE_PRODUCT = 'products:update',
  DELETE_PRODUCT = 'products:delete',
  
  // Content permissions
  CREATE_CONTENT = 'content:create',
  READ_CONTENT = 'content:read',
  UPDATE_CONTENT = 'content:update',
  DELETE_CONTENT = 'content:delete',
  
  // Brand permissions
  CREATE_BRAND = 'brands:create',
  READ_BRAND = 'brands:read',
  UPDATE_BRAND = 'brands:update',
  DELETE_BRAND = 'brands:delete',
  
  // Order permissions
  CREATE_ORDER = 'orders:create',
  READ_ORDER = 'orders:read',
  UPDATE_ORDER = 'orders:update',
  DELETE_ORDER = 'orders:delete',
  
  // Admin permissions
  CREATE_ADMIN = 'admin:create',
  READ_ADMIN = 'admin:read',
  UPDATE_ADMIN = 'admin:update',
  DELETE_ADMIN = 'admin:delete',
  
  // User permissions
  CREATE_USER = 'users:create',
  READ_USER = 'users:read',
  UPDATE_USER = 'users:update',
  DELETE_USER = 'users:delete',
  READ_PROFILE = 'profile:read',
  UPDATE_PROFILE = 'profile:update',
  
  // Other permissions
  MANAGE_PROMOTIONS = 'promotions:manage',
  UPDATE_INVENTORY = 'inventory:update'
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  CONTENT_ADMIN = 'content_admin',
  PRODUCT_ADMIN = 'product_admin',
  USER = 'user'
}

export const RolePermissions = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.PRODUCT_ADMIN]: [
    Permission.CREATE_PRODUCT,
    Permission.READ_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.UPDATE_INVENTORY,
    Permission.MANAGE_PROMOTIONS,
    Permission.READ_USER
  ],
  [UserRole.CONTENT_ADMIN]: [
    Permission.CREATE_CONTENT,
    Permission.READ_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.READ_USER
  ],
  [UserRole.USER]: [
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.READ_PRODUCT,
    Permission.CREATE_ORDER,
    Permission.READ_ORDER
  ]
};
