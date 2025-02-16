import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';
import { Permission } from '../../auth/constants/permissions';

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'John Doe',
    required: true,
    type: 'string',
    format: 'text',
    title: 'Tên',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'john@example.com',
    required: true,
    type: 'string',
    format: 'email',
    title: 'Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    required: true,
    type: 'string',
    format: 'password',
    minLength: 6,
    title: 'Mật khẩu',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
    type: 'string',
    enumName: 'UserRole',
    title: 'Vai trò',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsArray()
  @IsOptional()
  permissions?: Permission[];
} 