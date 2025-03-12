import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, Min } from 'class-validator';

export enum InventoryOperation {
  ADD = 'add',
  SUBTRACT = 'subtract',
  SET = 'set'
}

export class UpdateInventoryDto {
  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 50,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Loại thao tác',
    enum: InventoryOperation,
    example: InventoryOperation.ADD
  })
  @IsEnum(InventoryOperation)
  operation: InventoryOperation;

  @ApiProperty({
    description: 'Lý do cập nhật kho',
    example: 'Nhập hàng mới',
    required: false
  })
  @IsString()
  reason?: string;
} 