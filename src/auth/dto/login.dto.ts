import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'john@example.com',
    required: true,
    type: 'string', 
    format: 'email',
    title: 'Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    required: true,
    type: 'string',
    format: 'password',
    minLength: 6,
    title: 'Mật khẩu',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
