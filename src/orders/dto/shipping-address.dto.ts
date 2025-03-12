import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShippingAddressDto {
  @ApiProperty({
    description: 'Họ tên người nhận',
    example: 'Nguyễn Văn A'
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321'
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Địa chỉ',
    example: 'Số 123, Đường ABC'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Tỉnh/Thành phố',
    example: 'Hồ Chí Minh'
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Quận/Huyện',
    example: 'Quận 1'
  })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    description: 'Phường/Xã',
    example: 'Phường Bến Nghé'
  })
  @IsString()
  @IsNotEmpty()
  ward: string;

  @ApiProperty({
    description: 'Mã bưu điện',
    example: '700000',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  zipCode?: string;
} 