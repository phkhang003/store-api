import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty({ 
    description: 'Nội dung phản hồi',
    maxLength: 500 
  })
  @IsString()
  @MaxLength(500)
  content: string;
}