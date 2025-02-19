import { UserRole } from '../../users/schemas/user.schema';
import { Permission } from '../constants/permissions';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  refreshToken?: string;
} 