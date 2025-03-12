import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Đánh giá sao (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Tiêu đề đánh giá',
    example: 'Sản phẩm tuyệt vời',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Nội dung đánh giá',
    example: 'Sản phẩm rất tốt, da mặt mình cải thiện rõ rệt sau 2 tuần sử dụng'
  })
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'Hình ảnh đánh giá',
    example: ['review1.jpg', 'review2.jpg'],
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
} 