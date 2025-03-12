import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsMongoId, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Chăm sóc da'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Các sản phẩm chăm sóc da mặt',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Trạng thái danh mục',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'ID của danh mục cha',
    example: '60d21b4667d0d8992e610c85',
    required: false
  })
  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'Hình ảnh danh mục',
    example: 'skincare.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Icon danh mục',
    example: 'fa-skincare',
    required: false
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Thứ tự hiển thị',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Hiển thị nổi bật',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
} 