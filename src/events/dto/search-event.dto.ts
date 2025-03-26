import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class SearchEventDto {
  @ApiProperty({ 
    description: 'Từ khóa tìm kiếm',
    required: false 
  })
  @IsOptional()
  @IsString()
  keyword?: string;

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