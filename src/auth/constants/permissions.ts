export enum Permission {
  // Admin permissions
  CREATE_ADMIN = 'create:admin',
  READ_ADMIN = 'read:admin',
  UPDATE_ADMIN = 'update:admin',
  DELETE_ADMIN = 'delete:admin',

  // User permissions  
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  // Content permissions
  CREATE_CONTENT = 'create:content', 
  READ_CONTENT = 'read:content',
  UPDATE_CONTENT = 'update:content',
  DELETE_CONTENT = 'delete:content',

  // Product permissions
  CREATE_PRODUCT = 'create:product',
  READ_PRODUCT = 'read:product',
  UPDATE_PRODUCT = 'update:product',
  DELETE_PRODUCT = 'delete:product'
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
