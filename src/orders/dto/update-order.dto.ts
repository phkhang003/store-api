import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../enums/order.enum';

export class UpdateOrderDto extends PartialType(OmitType(CreateOrderDto, ['items'] as const)) {
  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    required: false
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
    required: false
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    description: 'Mã vận đơn',
    example: 'TK123456789',
    required: false
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({
    description: 'Mã thanh toán',
    example: 'PAY123456789',
    required: false
  })
  @IsString()
  @IsOptional()
  paymentId?: string;
} 