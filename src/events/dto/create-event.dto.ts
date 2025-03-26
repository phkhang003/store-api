import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsArray,
  IsNumber,
  IsMongoId,
  IsOptional,
  ValidateNested,
  Min,
  ArrayMinSize
} from 'class-validator';

class EventProductDto {
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

  @ApiProperty({ 
    example: 150000,
    description: 'Giá điều chỉnh trong sự kiện' 
  })
  @IsNumber()
  @Min(0)
  adjustedPrice: number;
}

export class CreateEventDto {
  @ApiProperty({ example: 'Flash Sale Tháng 6' })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Chương trình giảm giá đặc biệt',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: ['sale', 'summer'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-06-30T23:59:59.999Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ type: [EventProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventProductDto)
  @ArrayMinSize(1)
  products: EventProductDto[];
} 