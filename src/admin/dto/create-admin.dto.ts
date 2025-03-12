import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Tên admin',
    example: 'Admin Name',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'admin@example.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    required: true,
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Vai trò admin',
    enum: [UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN],
    example: UserRole.CONTENT_ADMIN,
    required: true
  })
  @IsEnum([UserRole.CONTENT_ADMIN, UserRole.PRODUCT_ADMIN])
  role: UserRole;
} 