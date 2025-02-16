import { Permission } from './permissions';
import { UserRole } from '../../users/schemas/user.schema';

export const RolePermissions = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.CONTENT_ADMIN]: [
    Permission.READ_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.READ_USER
  ],
  [UserRole.PRODUCT_ADMIN]: [
    Permission.READ_PRODUCT,
    Permission.CREATE_PRODUCT, 
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.READ_USER
  ],
  [UserRole.USER]: [
    Permission.READ_CONTENT,
    Permission.READ_PRODUCT
  ]
};
