import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsMongoId, Min } from 'class-validator';

export class SearchProductDto {
  @ApiProperty({
    description: 'Từ khóa tìm kiếm',
    required: false
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'ID danh mục',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiProperty({
    description: 'ID thương hiệu',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @ApiProperty({
    description: 'Giá tối thiểu',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Giá tối đa',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
} 