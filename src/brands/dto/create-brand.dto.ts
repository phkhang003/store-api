import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUrl,
  ValidateNested
} from 'class-validator';

class LogoDto {
  @ApiProperty({ example: 'https://example.com/logo.jpg' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'Logo thương hiệu XYZ' })
  @IsString()
  alt: string;
}

class SocialMediaDto {
  @ApiProperty({ required: false, example: 'https://facebook.com/brand' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({ required: false, example: 'https://instagram.com/brand' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({ required: false, example: 'https://youtube.com/brand' })
  @IsOptional()
  @IsUrl()
  youtube?: string;
}

export class CreateBrandDto {
  @ApiProperty({ example: 'Thương hiệu XYZ' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Mô tả về thương hiệu' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: {
      url: 'https://example.com/logo.jpg',
      alt: 'Logo thương hiệu XYZ'
    }
  })
  @ValidateNested()
  @Type(() => LogoDto)
  logo: LogoDto;

  @ApiProperty({ required: false, example: 'Hàn Quốc' })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({ required: false, example: 'https://brand.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @IsEnum(['active', 'inactive'])
  status: string;

  @ApiProperty({
    required: false,
    example: {
      facebook: 'https://facebook.com/brand',
      instagram: 'https://instagram.com/brand',
      youtube: 'https://youtube.com/brand'
    }
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;
} 