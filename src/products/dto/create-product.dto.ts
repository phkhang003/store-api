import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, IsNumber, IsArray, IsBoolean, 
  IsEnum, IsOptional, ValidateNested,
  IsMongoId, Min, IsUrl, IsDateString
} from 'class-validator';

export class DescriptionDto {
  @ApiProperty({ example: 'Mô tả ngắn' })
  @IsString()
  short: string;

  @ApiProperty({ example: 'Mô tả chi tiết' })
  @IsString()
  full: string;
}

export class SeoDto {
  @ApiProperty({ example: 'SEO Title' })
  @IsString()
  metaTitle: string;

  @ApiProperty({ example: 'SEO Description' })
  @IsString()
  metaDescription: string;

  @ApiProperty({ example: ['keyword1', 'keyword2'] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}

export class CreateProductDto {
  @ApiProperty({ example: 'SKU123' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Kem Chống Nắng XYZ' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'kem-chong-nang-xyz' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: {
      short: 'Mô tả ngắn',
      full: 'Mô tả chi tiết'
    }
  })
  @ValidateNested()
  @Type(() => DescriptionDto)
  description: DescriptionDto;

  @ApiProperty({
    example: {
      metaTitle: 'SEO Title',
      metaDescription: 'SEO Description',
      keywords: ['keyword1', 'keyword2']
    }
  })
  @ValidateNested()
  @Type(() => SeoDto)
  seo: SeoDto;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 450000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  currentPrice?: number;

  @ApiProperty({ enum: ['active', 'out_of_stock', 'discontinued'] })
  @IsEnum(['active', 'out_of_stock', 'discontinued'])
  status: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @ApiProperty({ example: ['507f1f77bcf86cd799439011'] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];
}

// Tạo thêm các DTO classes cho các properties phức tạp khác 