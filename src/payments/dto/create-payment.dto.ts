import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @ApiProperty()
  @IsMongoId()
  orderId: string;

  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  @Min(1000)
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  paymentDetails?: Record<string, any>;
}