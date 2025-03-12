import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Họ tên người dùng',
    example: 'Nguyễn Văn A',
    required: false
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'example@gmail.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321',
    required: false
  })
  @IsPhoneNumber('VN')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Địa chỉ',
    example: 'Số 123, Đường ABC, Quận XYZ, TP. HCM',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 