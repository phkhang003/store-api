import { UserRole } from '../../users/schemas/user.schema';
import { Permission } from '../../auth/constants/permissions';

export const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.CONTENT_ADMIN]: [
    Permission.CREATE_CONTENT,
    Permission.READ_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.READ_PRODUCT,
    Permission.READ_USER
  ],
  [UserRole.PRODUCT_ADMIN]: [
    Permission.CREATE_PRODUCT,
    Permission.READ_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.READ_CONTENT,
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