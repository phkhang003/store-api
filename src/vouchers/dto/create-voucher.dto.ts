import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
  Min,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({ 
    example: 'SUMMER2024',
    description: 'Mã giảm giá' 
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  code: string;

  @ApiProperty({ 
    example: 'Giảm giá mùa hè 2024',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    enum: ['percentage', 'fixed'],
    example: 'percentage' 
  })
  @IsEnum(['percentage', 'fixed'])
  discountType: string;

  @ApiProperty({ 
    example: 10,
    description: 'Giá trị giảm (% hoặc số tiền cố định)' 
  })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ 
    example: 100000,
    description: 'Giá trị đơn hàng tối thiểu' 
  })
  @IsNumber()
  @Min(0)
  minimumOrderValue: number;

  @ApiProperty({ 
    example: 50000,
    description: 'Giảm giá tối đa' 
  })
  @IsNumber()
  @Min(0)
  maxDiscount: number;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-06-30T23:59:59.999Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ 
    example: 100,
    description: 'Số lần sử dụng tối đa' 
  })
  @IsNumber()
  @Min(1)
  usageLimit: number;

  @ApiProperty({ 
    type: [String],
    required: false,
    description: 'Danh sách ID sản phẩm được áp dụng' 
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  applicableProducts?: string[];

  @ApiProperty({ 
    type: [String],
    required: false,
    description: 'Danh sách ID danh mục được áp dụng' 
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  applicableCategories?: string[];
}