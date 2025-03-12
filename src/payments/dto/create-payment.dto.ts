import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '../enums/payment.enum';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID của đơn hàng cần thanh toán',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'ID của người dùng thực hiện thanh toán',
    example: '60d21b4667d0d8992e610c80'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    enum: PaymentMethod,
    example: PaymentMethod.MOMO
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'URL trả về sau khi thanh toán',
    example: 'https://example.com/payment/callback'
  })
  @IsString()
  @IsNotEmpty()
  returnUrl: string;
} 