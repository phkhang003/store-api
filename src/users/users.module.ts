import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BaseUserService } from './services/base-user.service';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './profile.controller';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    forwardRef(() => SecurityModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController, ProfileController],
  providers: [BaseUserService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
