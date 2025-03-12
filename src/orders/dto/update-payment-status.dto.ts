import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../enums/order.enum';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    description: 'Trạng thái thanh toán',
    enum: PaymentStatus,
    example: PaymentStatus.PAID
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Mã thanh toán',
    example: 'PAY123456789',
    required: false
  })
  @IsString()
  @IsOptional()
  paymentId?: string;
} 