import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNumber, 
  IsMongoId, 
  IsOptional,
  ValidateNested,
  Min,
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsEmail
} from 'class-validator';
import { PaymentMethod } from '../../payments/schemas/payment.schema';

export class ProductOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shade?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string;
}

export class OrderProductDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  variantId?: string;

  @ApiProperty({ type: ProductOptionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductOptionsDto)
  options?: ProductOptionsDto;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ShippingInfoDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  contact: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderProductDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  voucherId?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo: ShippingInfoDto;

  @ApiProperty()
  @IsMongoId()
  branchId: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
} 