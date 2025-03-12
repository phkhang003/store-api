import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsDate, IsBoolean, IsOptional, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum PromotionType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE_SHIPPING = 'free_shipping',
  FREE_PRODUCT = 'free_product'
}

export class CreatePromotionDto {
  @ApiProperty({
    description: 'Mã khuyến mãi',
    example: 'SUMMER2023'
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Loại khuyến mãi',
    enum: PromotionType,
    example: PromotionType.PERCENTAGE
  })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty({
    description: 'Giá trị khuyến mãi (số tiền cố định hoặc phần trăm)',
    example: 10
  })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({
    description: 'Giá trị đơn hàng tối thiểu để áp dụng',
    example: 200000,
    required: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderValue?: number;

  @ApiProperty({
    description: 'Giảm giá tối đa (chỉ áp dụng cho loại phần trăm)',
    example: 100000,
    required: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscount?: number;

  @ApiProperty({
    description: 'Số lần sử dụng tối đa',
    example: 100,
    required: false
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUsage?: number;

  @ApiProperty({
    description: 'Chỉ áp dụng cho đơn hàng đầu tiên',
    example: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isFirstOrderOnly?: boolean;

  @ApiProperty({
    description: 'Ngày bắt đầu',
    example: '2023-06-01'
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc',
    example: '2023-08-31'
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Mô tả khuyến mãi',
    example: 'Giảm 10% cho đơn hàng từ 200K',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Danh mục sản phẩm được áp dụng',
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableCategories?: string[];

  @ApiProperty({
    description: 'Sản phẩm được áp dụng',
    example: ['60d21b4667d0d8992e610c87', '60d21b4667d0d8992e610c88'],
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableProducts?: string[];
} 