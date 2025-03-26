import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectedOptionsDto {
  @ApiProperty({ 
    description: 'Màu sắc được chọn',
    required: false,
    example: 'Đỏ' 
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ 
    description: 'Kích thước được chọn',
    required: false,
    example: 'L'
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ 
    description: 'Tông màu/sắc thái',
    required: false,
    example: 'Đỏ đậm'
  })
  @IsOptional()
  @IsString()
  shade?: string;
}

export class CreateCartItemDto {
  @ApiProperty({ description: 'ID của sản phẩm' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'ID của biến thể sản phẩm', required: false })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ description: 'Số lượng sản phẩm', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: SelectedOptionsDto })
  @IsOptional()
  selectedOptions?: SelectedOptionsDto;
} 