import { UserRole } from '../schemas/user.schema';

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
} 