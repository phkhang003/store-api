import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Tên chi nhánh',
    example: 'Chi nhánh Quận 1'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Địa chỉ chi nhánh',
    example: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Thông tin liên hệ',
    example: '028.3822.5678'
  })
  @IsString()
  @IsNotEmpty()
  contact: string;
} 