import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsUrl,
  ValidateNested,
  IsMongoId
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class ShippingCarrierDto {
  @ApiProperty({ example: 'Giao Hang Nhanh' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'GHN123456789' })
  @IsString()
  trackingNumber: string;

  @ApiProperty({ 
    example: 'https://tracking.ghn.vn/GHN123456789',
    required: false 
  })
  @IsOptional()
  @IsUrl()
  trackingUrl?: string;
}

export class CreateTrackingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  orderId: string;

  @ApiProperty({ 
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED
  })
  @IsEnum(OrderStatus)
  state: OrderStatus;

  @ApiProperty({ example: 'Đơn hàng đã được xác nhận' })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ type: ShippingCarrierDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingCarrierDto)
  shippingCarrier?: ShippingCarrierDto;

  @ApiProperty({ 
    example: '2024-06-01T10:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedDelivery?: Date;
} 