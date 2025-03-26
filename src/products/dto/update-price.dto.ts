import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdatePriceDto {
  @ApiProperty({
    description: 'Giá mới của sản phẩm',
    example: 500000,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;
} 