import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNumber, 
  IsMongoId, 
  IsOptional,
  ValidateNested,
  Min
} from 'class-validator';
import { ProductOptionsDto } from './product-options.dto';

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