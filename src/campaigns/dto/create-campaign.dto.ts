import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  Min,
  IsOptional,
  ArrayMinSize
} from 'class-validator';

class CampaignProductDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439012',
    required: false 
  })
  @IsOptional()
  @IsMongoId()
  variantId?: string;

  @ApiProperty({ example: 150000, description: 'Giá điều chỉnh trong chiến dịch' })
  @IsNumber()
  @Min(0)
  adjustedPrice: number;
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Khuyến mãi mùa hè' })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Chương trình khuyến mãi mùa hè 2024',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    enum: ['Hero Banner', 'Sale Event'],
    example: 'Sale Event' 
  })
  @IsEnum(['Hero Banner', 'Sale Event'])
  type: string;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-06-30T23:59:59.999Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ 
    type: [CampaignProductDto],
    description: 'Danh sách sản phẩm trong chiến dịch' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CampaignProductDto)
  @ArrayMinSize(1)
  products: CampaignProductDto[];
} 