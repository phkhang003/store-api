import { UserRole } from '../../users/schemas/user.schema';

export enum Permission {
  // User permissions
  READ_PROFILE = 'profile:read',
  UPDATE_PROFILE = 'profile:update',
  
  // Admin permissions
  CREATE_ADMIN = 'admin:create',
  READ_ADMIN = 'admin:read',
  UPDATE_ADMIN = 'admin:update',
  DELETE_ADMIN = 'admin:delete',
  
  // User management
  CREATE_USER = 'users:create',
  READ_USER = 'users:read',
  UPDATE_USER = 'users:update',
  DELETE_USER = 'users:delete',
  
  // Content permissions  
  CREATE_CONTENT = 'content:create',
  READ_CONTENT = 'content:read',
  UPDATE_CONTENT = 'content:update',
  DELETE_CONTENT = 'content:delete',

  // Product permissions
  CREATE_PRODUCT = 'products:create',
  READ_PRODUCT = 'products:read',
  UPDATE_PRODUCT = 'products:update',
  DELETE_PRODUCT = 'products:delete',
  
  // Order permissions
  CREATE_ORDER = 'orders:create',
  READ_ORDER = 'orders:read',
  UPDATE_ORDER = 'orders:update',
  DELETE_ORDER = 'orders:delete'
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  CONTENT_ADMIN = 'content_admin',
  PRODUCT_ADMIN = 'product_admin',
  USER = 'user'
}

export const RolePermissions = {
  SUPER_ADMIN: [
    ...Object.values(Permission)
  ],
  CONTENT_ADMIN: [
    Permission.CREATE_CONTENT,
    Permission.READ_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.READ_PRODUCT,
    Permission.READ_USER
  ],
  PRODUCT_ADMIN: [
    Permission.CREATE_PRODUCT,
    Permission.READ_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.READ_CONTENT,
    Permission.READ_USER
  ],
  USER: [
    Permission.READ_CONTENT,
    Permission.READ_PRODUCT
  ]
}
