import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Tên admin',
    example: 'Admin User'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email admin',
    example: 'admin@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'admin123'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Loại admin',
    enum: UserRole,
    example: UserRole.CONTENT_ADMIN
  })
  @IsEnum(UserRole)
  role: UserRole;
} 