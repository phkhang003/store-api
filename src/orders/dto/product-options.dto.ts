import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

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