import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

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