import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsArray, IsPhoneNumber, ValidateNested, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../auth/enums/role.enum';
import { Permission } from '../../auth/constants/permissions';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ example: '123 Đường ABC, Quận XYZ' })
  @IsString()
  addressLine: string;

  @ApiProperty({ example: 'Hồ Chí Minh' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Hồ Chí Minh' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'Việt Nam' })
  @IsString()
  country: string;

  @ApiProperty({ example: '700000' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

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
    description: 'Số điện thoại',
    example: '0987654321',
    required: true,
    type: 'string',
    format: 'phone',
    title: 'Số điện thoại',
  })
  @IsPhoneNumber('VN')
  phone: string;

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

  @ApiProperty({ type: [AddressDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
} 