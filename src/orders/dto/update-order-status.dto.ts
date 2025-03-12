import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: 'Lý do hủy đơn hàng (nếu trạng thái là CANCELLED)',
    example: 'Khách hàng yêu cầu hủy',
    required: false
  })
  @IsString()
  @IsOptional()
  cancelReason?: string;
} 