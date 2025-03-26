import { UserRole } from '../enums/role.enum';
import { Permission } from '../constants/permissions';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions?: string[];
} 