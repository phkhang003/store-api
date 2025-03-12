import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentStatus } from '../enums/order.enum';
import { OrderItemDto } from './order-item.dto';
import { ShippingAddressDto } from './shipping-address.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Danh sách sản phẩm',
    type: [OrderItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    type: ShippingAddressDto
  })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({
    description: 'Số điện thoại nhận hàng',
    example: '0123456789'
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'cod'
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Mã giảm giá',
    example: 'WELCOME10',
    required: false
  })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiProperty({
    description: 'Ghi chú đơn hàng',
    example: 'Giao hàng trong giờ hành chính',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Đơn hàng là quà tặng',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isGift?: boolean;

  @ApiProperty({
    description: 'Lời nhắn quà tặng',
    example: 'Chúc mừng sinh nhật!',
    required: false
  })
  @IsString()
  @IsOptional()
  giftMessage?: string;
} 