import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    description: 'Số lượng tồn kho mới',
    example: 100,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}

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