import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsBoolean,
  IsEnum,
  ValidateNested,
  Min
} from 'class-validator';

class ImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'Mô tả hình ảnh' })
  @IsString()
  alt: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Chăm sóc da' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'cham-soc-da' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Các sản phẩm chăm sóc da' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  level: number;

  @ApiProperty({
    example: {
      url: 'https://example.com/image.jpg',
      alt: 'Mô tả hình ảnh'
    }
  })
  @ValidateNested()
  @Type(() => ImageDto)
  image: ImageDto;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @IsEnum(['active', 'inactive'])
  status: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
} 