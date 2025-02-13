import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // Làm cho ConfigModule có thể truy cập từ mọi nơi
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      retryAttempts: 3,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB connected successfully');
          console.log('Database:', connection.name);
        });
        connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        connection.on('disconnected', () => {
          console.log('MongoDB disconnected');
        });
        return connection;
      }
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
