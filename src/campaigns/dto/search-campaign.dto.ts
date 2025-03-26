import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class SearchCampaignDto {
  @ApiProperty({
    description: 'Từ khóa tìm kiếm',
    required: false
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Loại chiến dịch',
    enum: ['Hero Banner', 'Sale Event'],
    required: false
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Ngày bắt đầu',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({
    description: 'Ngày kết thúc',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
} 