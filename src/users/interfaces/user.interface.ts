import { UserRole } from '../../auth/enums/role.enum';
import { Permission } from '../../auth/constants/permissions';

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  permissions?: Permission[];
} 