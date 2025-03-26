import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, IsOptional, IsMongoId, Min } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class SearchProductDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
} 