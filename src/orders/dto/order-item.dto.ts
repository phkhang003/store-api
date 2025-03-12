import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  quantity: number;
} 