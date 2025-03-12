import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Tên thương hiệu',
    example: 'The Ordinary'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả thương hiệu',
    example: 'Thương hiệu mỹ phẩm với công thức đơn giản và hiệu quả',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Hình ảnh thương hiệu',
    example: 'the-ordinary.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  image?: string;
} 