import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsUrl,
  ArrayMinSize,
  MaxLength
} from 'class-validator';

class ReviewImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  alt?: string;
}

export class CreateReviewDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  variantId?: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  orderId: string;

  @ApiProperty({ 
    description: 'Đánh giá từ 1-5 sao',
    minimum: 1,
    maximum: 5 
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ 
    description: 'Nội dung đánh giá',
    maxLength: 1000 
  })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({ 
    type: [ReviewImageDto],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewImageDto)
  @ArrayMinSize(1)
  images?: ReviewImageDto[];
} 