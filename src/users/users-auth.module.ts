import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    UsersModule
  ],
  exports: [UsersModule]
})
export class UsersAuthModule {} 